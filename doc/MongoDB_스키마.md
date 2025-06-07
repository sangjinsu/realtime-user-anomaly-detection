## **📁 서비스별 컬렉션 구조**

### **🧩 Auth Service**

### **🔸users**

### **컬렉션**

| **필드** | **타입** | **설명** |
| --- | --- | --- |
| _id | ObjectId | 기본 MongoDB ID |
| email | String | 로그인용 이메일 (고유) |
| password | String | 암호화된 비밀번호 |
| role | String | USER / OPERATOR / ADMIN |
| blocked | Boolean | 차단 여부 (기본값: false) |
| createdAt | Date | 생성 시각 |
| updatedAt | Date | 수정 시각 |

```ts
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ enum: ['USER', 'OPERATOR', 'ADMIN'], default: 'USER' })
  role: string;
  @Prop({ default: false }) blocked: boolean;
}
```

---

### **🧩 Monitor Service**

### **🔸logs**

### **컬렉션**

| **필드** | **타입** | **설명** |
| --- | --- | --- |
| _id | ObjectId | 기본 MongoDB ID |
| userId | ObjectId (ref: User) | 유저 참조 |
| action | String | 유저 행동 (예: LOGIN, CLAIM_REWARD) |
| metadata | Object | 선택적 상세 정보 |
| timestamp | Date | 로그 발생 시각 (기본값: Date.now()) |

```ts
@Schema()
export class Log {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: ObjectId;

  @Prop({ required: true }) action: string;

  @Prop({ type: Object }) metadata: Record<string, any>;

  @Prop({ default: () => new Date() }) timestamp: Date;
}
```

---

### **🔸warnings**

### **컬렉션**

| **필드** | **타입** | **설명** |
| --- | --- | --- |
| _id | ObjectId | 기본 MongoDB ID |
| userId | ObjectId (ref: User) | 경고 받은 유저 |
| reason | String | 경고 사유 |
| detectedBy | String | 탐지 전략 이름 (예: FrequentLoginStrategy) |
| autoBlocked | Boolean | 자동 차단 여부 |
| createdAt | Date | 생성 시각 |

```ts
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Warning {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: ObjectId;

  @Prop({ required: true }) reason: string;

  @Prop() detectedBy: string;

  @Prop({ default: false }) autoBlocked: boolean;
}
```

---

## **🔐  유저 차단**

- 유저 차단 여부는 User.blocked 필드로 처리
- 로그인 시 blocked === true 이면 로그인 불가 처리

---