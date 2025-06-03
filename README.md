# Metin Temelli Sanal Terapi API

Metin tabanlı girişlerden duygu durumu analizi yaparak kişiselleştirilmiş içerik önerileri sunan bir API.

## Özellikler

- 🔐 JWT tabanlı kimlik doğrulama ve yetkilendirme
- 📝 Kullanıcı günlük girişleri
- 🧠 Duygu durumu analizi (Gemini API entegrasyonu)
- 📊 Duygu durumu istatistikleri
- 📚 Duygu durumuna göre kişiselleştirilmiş içerik önerileri
- 🛡️ Güvenlik önlemleri (Helmet)

## Teknoloji Yığını

- **NodeJS:** v20.x (LTS)
- **Express:** REST API çerçevesi
- **PostgreSQL:** Veritabanı
- **Prisma:** ORM
- **JWT:** Kimlik doğrulama
- **Winston:** Loglama
- **Jest:** Test

## Kurulum

1. Repoyu klonlayın:
   ```bash
   git clone <repo-url>
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env` dosyasını oluşturun (`.env-example` dosyasını referans alabilirsiniz):
   ```bash
   cp .env-example .env
   ```

4. Veritabanını oluşturun:
   ```bash
   npx prisma migrate dev
   ```

5. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```

## API Endpoints

### Durum Kontrolü

- `GET /api/v1/status` - API durumunu kontrol et

**Cevap Örneği:**
```json
{
  "status": "success",
  "message": "API çalışıyor",
  "timestamp": "2023-08-01T12:00:00.000Z"
}
```

### Kimlik Doğrulama

#### Kullanıcı Kaydı
- `POST /api/v1/auth/register` - Kullanıcı kaydı

**İstek Body Örneği:**
```json
{
  "email": "kullanici@ornek.com",
  "password": "guvenli_sifre123",
  "name": "Örnek Kullanıcı"
}
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
      "email": "kullanici@ornek.com",
      "name": "Örnek Kullanıcı",
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Kullanıcı Girişi
- `POST /api/v1/auth/login` - Kullanıcı girişi

**İstek Body Örneği:**
```json
{
  "email": "kullanici@ornek.com",
  "password": "guvenli_sifre123"
}
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
      "email": "kullanici@ornek.com",
      "name": "Örnek Kullanıcı",
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Kullanıcı Profili
- `GET /api/v1/auth/profile` - Kullanıcı profili

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
      "email": "kullanici@ornek.com",
      "name": "Örnek Kullanıcı"
    }
  }
}
```

### Günlük

#### Yeni Günlük Girişi
- `POST /api/v1/journals` - Yeni günlük girişi oluştur

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**İstek Body Örneği:**
```json
{
  "text": "Bugün kendimi çok iyi hissediyorum. Sabah erken kalktım ve güzel bir kahvaltı yaptım. İşlerim yolunda gidiyor ve bu beni mutlu ediyor."
}
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "data": {
    "journalEntry": {
      "id": "7d9e6f2a-3b1c-4d5e-9f8a-1b2c3d4e5f6a",
      "text": "Bugün kendimi çok iyi hissediyorum. Sabah erken kalktım ve güzel bir kahvaltı yaptım. İşlerim yolunda gidiyor ve bu beni mutlu ediyor.",
      "userId": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    },
    "moodAnalysis": {
      "id": "8e9f7g6h-5i4j-3k2l-1m0n-9o8p7q6r5s4t",
      "journalEntryId": "7d9e6f2a-3b1c-4d5e-9f8a-1b2c3d4e5f6a",
      "moodLabel": "mutlu",
      "moodScore": 0.85,
      "analysis": "Metninizde mutlu duygu durumuna işaret eden ifadeler var. Bu duygu durumunuzu anlamak ve yönetmek için birkaç öneri sunuyorum.",
      "suggestions": [
        "Bu pozitif enerjiyi yaratıcı aktivitelere yönlendirmeyi deneyin",
        "Sevdiğiniz biriyle bu mutluluğu paylaşın",
        "Mutlu anları günlüğünüze kaydetmek gelecekte size ilham verebilir"
      ],
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    }
  }
}
```

#### Kullanıcının Günlük Girişleri
- `GET /api/v1/journals` - Kullanıcının günlük girişlerini getir

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "entries": [
      {
        "id": "7d9e6f2a-3b1c-4d5e-9f8a-1b2c3d4e5f6a",
        "text": "Bugün kendimi çok iyi hissediyorum. Sabah erken kalktım ve güzel bir kahvaltı yaptım. İşlerim yolunda gidiyor ve bu beni mutlu ediyor.",
        "userId": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
        "createdAt": "2023-08-01T12:00:00.000Z",
        "updatedAt": "2023-08-01T12:00:00.000Z",
        "moodAnalysis": {
          "id": "8e9f7g6h-5i4j-3k2l-1m0n-9o8p7q6r5s4t",
          "journalEntryId": "7d9e6f2a-3b1c-4d5e-9f8a-1b2c3d4e5f6a",
          "moodLabel": "mutlu",
          "moodScore": 0.85,
          "analysis": "Metninizde mutlu duygu durumuna işaret eden ifadeler var. Bu duygu durumunuzu anlamak ve yönetmek için birkaç öneri sunuyorum.",
          "suggestions": [
            "Bu pozitif enerjiyi yaratıcı aktivitelere yönlendirmeyi deneyin",
            "Sevdiğiniz biriyle bu mutluluğu paylaşın",
            "Mutlu anları günlüğünüze kaydetmek gelecekte size ilham verebilir"
          ],
          "createdAt": "2023-08-01T12:00:00.000Z",
          "updatedAt": "2023-08-01T12:00:00.000Z"
        }
      }
    ]
  }
}
```

#### Belirli Bir Günlük Girişi
- `GET /api/v1/journals/:id` - Belirli bir günlük girişini getir

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "data": {
    "entry": {
      "id": "7d9e6f2a-3b1c-4d5e-9f8a-1b2c3d4e5f6a",
      "text": "Bugün kendimi çok iyi hissediyorum. Sabah erken kalktım ve güzel bir kahvaltı yaptım. İşlerim yolunda gidiyor ve bu beni mutlu ediyor.",
      "userId": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z",
      "moodAnalysis": {
        "id": "8e9f7g6h-5i4j-3k2l-1m0n-9o8p7q6r5s4t",
        "journalEntryId": "7d9e6f2a-3b1c-4d5e-9f8a-1b2c3d4e5f6a",
        "moodLabel": "mutlu",
        "moodScore": 0.85,
        "analysis": "Metninizde mutlu duygu durumuna işaret eden ifadeler var. Bu duygu durumunuzu anlamak ve yönetmek için birkaç öneri sunuyorum.",
        "suggestions": [
          "Bu pozitif enerjiyi yaratıcı aktivitelere yönlendirmeyi deneyin",
          "Sevdiğiniz biriyle bu mutluluğu paylaşın",
          "Mutlu anları günlüğünüze kaydetmek gelecekte size ilham verebilir"
        ],
        "createdAt": "2023-08-01T12:00:00.000Z",
        "updatedAt": "2023-08-01T12:00:00.000Z"
      }
    }
  }
}
```

#### Günlük Girişi Silme
- `DELETE /api/v1/journals/:id` - Belirli bir günlük girişini sil

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "message": "Günlük girişi başarıyla silindi"
}
```

#### Duygu Durumu Analizleri
- `GET /api/v1/journals/analytics/mood` - Kullanıcının duygu durumu analizlerini getir

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "analytics": [
      {
        "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        "userId": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
        "date": "2023-08-01T12:00:00.000Z",
        "moodLabel": "mutlu",
        "moodScore": 0.85,
        "createdAt": "2023-08-01T12:00:00.000Z"
      },
      {
        "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
        "userId": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
        "date": "2023-07-30T14:30:00.000Z",
        "moodLabel": "kaygılı",
        "moodScore": 0.65,
        "createdAt": "2023-07-30T14:30:00.000Z"
      },
      {
        "id": "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
        "userId": "5f8d0e3a-4c9d-4b1f-8f5d-2c8e6f05c7a2",
        "date": "2023-07-28T09:15:00.000Z",
        "moodLabel": "nötr",
        "moodScore": 0.50,
        "createdAt": "2023-07-28T09:15:00.000Z"
      }
    ]
  }
}
```

### İçerik

#### Tüm İçerikler
- `GET /api/v1/contents` - Tüm içerikleri getir

**Query Parametreleri:**
- `category` (opsiyonel): İçerik kategorisi
- `tags` (opsiyonel): Virgülle ayrılmış etiketler

**Cevap Örneği:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "contents": [
      {
        "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        "title": "Stresle Başa Çıkma Teknikleri",
        "content": "Stresle başa çıkmanın birçok yolu vardır. İşte bazı etkili teknikler...",
        "category": "meditasyon",
        "tags": ["stres", "rahatlama", "meditasyon"],
        "createdAt": "2023-08-01T12:00:00.000Z",
        "updatedAt": "2023-08-01T12:00:00.000Z"
      },
      {
        "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
        "title": "Günlük Motivasyon: Pozitif Düşünce",
        "content": "Pozitif düşünce, hayatınızı olumlu yönde değiştirebilir...",
        "category": "motivasyon",
        "tags": ["pozitif", "motivasyon", "düşünce"],
        "createdAt": "2023-07-30T14:30:00.000Z",
        "updatedAt": "2023-07-30T14:30:00.000Z"
      }
    ]
  }
}
```

#### Belirli Bir İçerik
- `GET /api/v1/contents/:id` - Belirli bir içeriği getir

**Cevap Örneği:**
```json
{
  "status": "success",
  "data": {
    "content": {
      "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "title": "Stresle Başa Çıkma Teknikleri",
      "content": "Stresle başa çıkmanın birçok yolu vardır. İşte bazı etkili teknikler...",
      "category": "meditasyon",
      "tags": ["stres", "rahatlama", "meditasyon"],
      "createdAt": "2023-08-01T12:00:00.000Z",
      "updatedAt": "2023-08-01T12:00:00.000Z"
    }
  }
}
```

#### Duygu Durumuna Göre İçerik Önerileri
- `GET /api/v1/contents/recommendations/:moodLabel` - Duygu durumuna göre içerik öner

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cevap Örneği:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "contents": [
      {
        "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        "title": "Kaygıyı Azaltmanın 5 Kolay Yolu",
        "content": "Kaygı hissiyle başa çıkmak için uygulayabileceğiniz 5 basit teknik...",
        "category": "rahatlama",
        "tags": ["kaygı", "rahatlama", "nefes"],
        "createdAt": "2023-08-01T12:00:00.000Z",
        "updatedAt": "2023-08-01T12:00:00.000Z"
      },
      {
        "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
        "title": "Gerginliği Azaltan 10 Dakikalık Meditasyon",
        "content": "Bu kısa meditasyon egzersizi, hızla sakinleşmenize yardımcı olacak...",
        "category": "meditasyon",
        "tags": ["meditasyon", "rahatlama", "kısa"],
        "createdAt": "2023-07-30T14:30:00.000Z",
        "updatedAt": "2023-07-30T14:30:00.000Z"
      }
    ]
  }
}
```

## Gemini API Entegrasyonu

Bu API, Google'ın Gemini AI modelini kullanarak metin analizleri gerçekleştirir. Gemini, API'ın duygu analizi ve öneriler sunma özelliklerinin temelini oluşturur.

### Kurulum

1. [Google AI Studio](https://ai.google.dev/)'dan bir API anahtarı edinin
2. API anahtarını `.env` dosyasında `GEMINI_API_KEY` değişkenine atayın

### Kullanılan Özellikler

- **Duygu Analizi**: Kullanıcının metin girdilerinden duygu durumu tespiti
- **Profesyonel Öneriler**: Klinik psikolog yaklaşımıyla kişiselleştirilmiş tavsiyeler
- **Yedek Sistem**: API anahtarı tanımlanmadığında veya hata durumunda yerel analiz sistemi

### Prompt Stratejisi

API, Gemini modelini şu şekilde yönlendirir:
1. Klinik psikolog rolünü benimsetme
2. Metinden duygu durumu çıkarımı
3. Duygu yoğunluğu skoru belirleme (0-1 arası)
4. Profesyonel bir analiz oluşturma
5. Duygu durumuna özgü, uygulanabilir öneriler sunma

### Örnek Prompt

```
Sen deneyimli bir klinik psikolog olarak hizmet vermektesin. Aşağıdaki metni analiz et ve yazarın duygu durumunu belirle.

Metni analiz ederken şunları yap:
1. Metinden algılanabilir temel duygu durumunu belirle (örn: mutlu, üzgün, kaygılı, öfkeli, nötr, umutlu vs.)
2. 0 ile 1 arasında bu duygunun yoğunluğunu gösteren bir skor belirle
3. Metindeki duygu durumuna ilişkin profesyonel bir analiz yaz (2-3 cümle)
4. Kişinin duygu durumuna uygun, terapötik, somut ve uygulanabilir 3 öneri sun

Yanıtını JSON formatında oluştur.
```

## Frontend için Hızlı Başlangıç

### Axios Kurulumu

```bash
npm install axios
```

### API İstemci Örneği

```javascript
// src/api/client.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek intercept edici - token ekler
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Kimlik Doğrulama Servisi Örneği

```javascript
// src/services/auth-service.js
import apiClient from '../api/client';

export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};
```

### Günlük Servisi Örneği

```javascript
// src/services/journal-service.js
import apiClient from '../api/client';

export const createEntry = async (text) => {
  const response = await apiClient.post('/journals', { text });
  return response.data;
};

export const getEntries = async () => {
  const response = await apiClient.get('/journals');
  return response.data;
};

export const getEntryById = async (id) => {
  const response = await apiClient.get(`/journals/${id}`);
  return response.data;
};

export const getMoodAnalytics = async () => {
  const response = await apiClient.get('/journals/analytics/mood');
  return response.data;
};

export const deleteEntry = async (id) => {
  const response = await apiClient.delete(`/journals/${id}`);
  return response.data;
};
```

### İçerik Servisi Örneği

```javascript
// src/services/content-service.js
import apiClient from '../api/client';

export const getContents = async (params = {}) => {
  const response = await apiClient.get('/contents', { params });
  return response.data;
};

export const getContentById = async (id) => {
  const response = await apiClient.get(`/contents/${id}`);
  return response.data;
};

export const getRecommendations = async (moodLabel) => {
  const response = await apiClient.get(`/contents/recommendations/${moodLabel}`);
  return response.data;
};
```

## Geliştirme

### Testleri Çalıştırma

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Docker ile Kurulum

```bash
docker-compose up -d
```

## Lisans

Bu proje ISC lisansı ile lisanslanmıştır. 