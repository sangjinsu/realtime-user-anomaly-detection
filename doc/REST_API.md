## **🧩 1. Auth Service**

### **🔐 회원가입**

POST /auth/register

```json
요청: {
  "email": "user@example.com",
  "password": "secure123"
}
응답: {
  "message": "User registered successfully"
}
```

---

### **🔐 로그인**

POST /auth/login

```json
요청: {
  "email": "user@example.com",
  "password": "secure123"
}
응답: {
  "accessToken": "<JWT>"
}
```

---

### **🔐 내 정보 조회**

GET /auth/me

> JWT 필요 (Authorization: Bearer)

---

## **🧩 2. Monitor Service**

### **📝 유저 행동 로그 저장**

POST /logs

```json
요청: {
  "action": "LOGIN",
  "metadata": {
    "ip": "192.168.0.1"
  }
}
응답: {
  "message": "Log recorded"
}
```

> JWT 필요 (role: USER 이상)

---

### **📄 전체 로그 조회 (운영자용)**

GET /logs

> 쿼리 파라미터: userId, action, from, to

> JWT 필요 (role: OPERATOR 이상)

---

### **🚨 경고 생성**

POST /detect/anomaly

> 내부 서비스에서 로그 기록 후 조건 검사

---

### **⚠️ 내 경고 이력 조회**

GET /warnings/me

```json
응답: [
  {
    "reason": "Too many login attempts",
    "detectedBy": "FrequentLoginStrategy",
    "createdAt": "2025-06-01T10:00:00Z"
  }
]
```

> JWT 필요 (role: USER 이상)

---

### **⚠️ 전체 경고 이력 조회 (운영자/관리자)**

GET /warnings

> 쿼리: userId, from, to, autoBlocked

> JWT 필요 (role: OPERATOR, ADMIN)

---

## **🧩 3. Admin Service (선택 기능)**

### **🚫 유저 차단**

POST /admin/block/:userId

> JWT 필요 (role: ADMIN)
>

### **♻️ 유저 차단 해제**

POST /admin/unblock/:userId

> JWT 필요 (role: ADMIN)
>

---

## **📌 인증 헤더 예시**

```
Authorization: Bearer <access_token>
```

---

## **🧪 테스트 시나리오 구성**

| **API** | **테스트 목적** |
| --- | --- |
| /auth/login | JWT 발급 확인 |
| /logs | 로그 저장 & 탐지 로직 연결 확인 |
| /warnings/me | 경고 발생 여부 확인 |
| /warnings | 운영자 필터링 조회 확인 |

---