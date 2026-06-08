# 배포 가이드 (GSM SV 기준)

GSM SV 콘솔에서 VM을 발급받아 `nest-blog-api`를 Docker Compose로 배포하는 전체 과정을 설명합니다.

---

## 포트 구조 이해

GSM SV VM은 생성 시 아래 세 개의 포트가 자동 할당됩니다.

| VM 내부 포트 | 역할 | 외부 접속 포트 (예시) |
|------------|------|-------------------|
| 22 | SSH 접속 | :21121 |
| 80 | HTTP 서비스 | :22121 |
| 10000 | SVC (커스텀) | :23121 |

> 실제 외부 포트는 인스턴스 상세 페이지의 **방화벽 규칙** 항목에서 확인합니다.

`docker-compose.yml`은 컨테이너 포트 3000을 VM의 **80번 포트**로 매핑하도록 설정되어 있습니다.  
결과적으로 외부에서는 `http://ssh.gsmsv.site:<HTTP 외부 포트>`로 접속하게 됩니다.

```
외부 클라이언트 → ssh.gsmsv.site:22121 → VM:80 → Docker 컨테이너:3000
```

---

## 목차

1. [VM 발급 및 포트 확인](#1-vm-발급-및-포트-확인)
2. [SSH 접속](#2-ssh-접속)
3. [SSH Key 설정 (선택 권장)](#3-ssh-key-설정-선택-권장)
4. [서버 환경 준비](#4-서버-환경-준비)
5. [프로젝트 준비](#5-프로젝트-준비)
6. [환경변수 설정](#6-환경변수-설정)
7. [Docker Compose 배포](#7-docker-compose-배포)
8. [배포 확인](#8-배포-확인)
9. [운영 명령어](#9-운영-명령어)

---

## 1. VM 발급 및 포트 확인

[gsmsv.site](https://gsmsv.site) 콘솔 → `/deploy` 페이지에서 VM을 생성합니다.

| 단계 | 내용 |
|------|------|
| OS 선택 | Ubuntu 22.04 LTS |
| 노드 선택 | 리소스 사용률이 낮은 노드 선택 |
| 사양 선택 | small(2 vCPU / 4 GB) 이상 권장 |
| 확인 | 정보 확인 후 생성 |

생성 후 인스턴스 상세 페이지 → **방화벽 규칙** 항목에서 포트를 확인합니다.

| 확인 항목 | 위치 |
|---------|------|
| SSH 외부 포트 | TCP 22 행의 오른쪽 포트 번호 |
| HTTP 외부 포트 | TCP 80 행의 오른쪽 포트 번호 |
| 초기 비밀번호 | 인스턴스 상세 페이지 별도 항목 |

---

## 2. SSH 접속

방화벽 규칙에서 확인한 **SSH 외부 포트**로 접속합니다.

```bash
ssh ubuntu@ssh.gsmsv.site -p <SSH 외부 포트>
```

> **예시** — SSH 외부 포트가 `21121`인 경우
> ```bash
> ssh ubuntu@ssh.gsmsv.site -p 21121
> ```

접속 후 초기 비밀번호를 변경합니다.

```bash
passwd
```

---

## 3. SSH Key 설정 (선택 권장)

비밀번호 없이 접속하려면 SSH Key를 등록합니다.

### 로컬 머신에서 — 키 생성

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_gsmsv
```

### 로컬 머신에서 — 공개키 복사

**macOS**
```bash
cat ~/.ssh/id_ed25519_gsmsv.pub | pbcopy
```

**Windows (PowerShell)**
```powershell
Get-Content ~/.ssh/id_ed25519_gsmsv.pub | Set-Clipboard
```

**Linux**
```bash
cat ~/.ssh/id_ed25519_gsmsv.pub | xclip -selection clipboard
```

### VM에서 — 공개키 등록

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "복사한_공개키_내용" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 로컬 머신에서 — 키로 접속 확인

```bash
ssh -i ~/.ssh/id_ed25519_gsmsv ubuntu@ssh.gsmsv.site -p <SSH 외부 포트>
```

### VM에서 — 비밀번호 인증 비활성화 (권장)

```bash
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' \
  /etc/ssh/sshd_config.d/60-cloudimg-settings.conf
sudo systemctl restart sshd
```

---

## 4. 서버 환경 준비

VM에 SSH 접속한 상태에서 Docker와 Docker Compose를 설치합니다.

```bash
# 패키지 목록 업데이트
sudo apt-get update

# 필수 패키지 설치
sudo apt-get install -y ca-certificates curl

# Docker GPG 키 추가
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Docker 저장소 추가
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 현재 사용자에게 Docker 권한 부여
sudo usermod -aG docker $USER
newgrp docker
```

설치 확인:

```bash
docker --version
docker compose version
```

---

## 5. 프로젝트 준비

### Git으로 클론

```bash
git clone <레포지토리 URL> nest-blog-api
cd nest-blog-api
```

### 또는 로컬에서 파일 전송 (scp)

```bash
# 로컬 머신에서 실행 — SSH 외부 포트 사용
scp -P <SSH 외부 포트> -r ./nest-blog-api ubuntu@ssh.gsmsv.site:~/nest-blog-api
```

---

## 6. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```bash
cd ~/nest-blog-api
```

```bash
cat > .env << 'EOF'
JWT_SECRET=여기에_강력한_비밀키를_입력하세요
EOF
```

> **JWT_SECRET 생성 예시**
> ```bash
> openssl rand -hex 32
> ```

`.env` 파일 권한을 제한합니다.

```bash
chmod 600 .env
```

---

## 7. Docker Compose 배포

```bash
docker compose up -d --build
```

- `-d` — 백그라운드 실행
- `--build` — 이미지 새로 빌드

빌드는 처음 실행 시 수 분 소요됩니다.  
완료되면 컨테이너가 VM의 80번 포트에 바인딩됩니다.

---

## 8. 배포 확인

### 컨테이너 상태 확인

```bash
docker compose ps
```

`api` 서비스가 `running (healthy)` 또는 `Up` 상태여야 합니다.

### 로그 확인

```bash
docker compose logs -f
```

정상 기동 시 아래와 같은 메시지가 출력됩니다.

```
[Nest] LOG [NestApplication] Nest application successfully started
```

### VM 내부에서 동작 확인

```bash
curl http://localhost:80/api-docs-json
```

### 외부에서 접속

방화벽 규칙의 **HTTP 외부 포트**로 접속합니다.

```
http://ssh.gsmsv.site:<HTTP 외부 포트>
```

> **예시** — HTTP 외부 포트가 `22121`인 경우
>
> | 용도 | URL |
> |------|-----|
> | API Root | `http://ssh.gsmsv.site:22121` |
> | Swagger UI | `http://ssh.gsmsv.site:22121/api-docs` |
> | Health Check | `http://ssh.gsmsv.site:22121/api-docs-json` |

---

## 9. 운영 명령어

| 목적 | 명령어 |
|------|--------|
| 서비스 재시작 | `docker compose restart` |
| 서비스 중지 | `docker compose down` |
| 이미지 재빌드 후 배포 | `docker compose up -d --build` |
| 실시간 로그 보기 | `docker compose logs -f` |
| 컨테이너 셸 접속 | `docker compose exec api sh` |
| SQLite 데이터 위치 확인 | `docker volume inspect nest-blog-api_sqlite_data` |

### 코드 업데이트 후 재배포

```bash
git pull
docker compose up -d --build
```

### 데이터 초기화 (주의)

SQLite 볼륨을 삭제하면 모든 데이터가 영구적으로 사라집니다.

```bash
docker compose down -v   # 볼륨 포함 삭제
docker compose up -d --build
```
