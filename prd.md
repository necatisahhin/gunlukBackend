**Project Requirement Document (PRD): Metin Temelli Sanal Terapi**

---

### **1. Proje Tanımı**

**Proje Adı:** Metin Temelli Sanal Terapi
**Amaç:** Kullanıcıların metin bazlı olarak duygu durumlarını analiz eden, onlara motive edici mesajlar ve öneriler sunarak psikolojik destek sağlayan bir web ve mobil uygulama oluşturmak.

---

### **2. Amaç ve Hedefler**

* **Amaç:** Kullanıcıların metin yoluyla ruh hallerini yansıtmasına olanak tanıyan ve yapay zekâ desteğiyle olumlu geri bildirim sunan bir sistem geliştirmek.
* **Hedefler:**

  * Kullanıcının yazılı metnine dayalı olarak duygu durumu analizi yapmak.
  * Duygu durumuna uygun motive edici mesajlar sunmak.
  * Kullanıcıların ilerlemesini izleyerek kişiselleştirilmiş çözümler önermek.
  * Çeşitli temalarda rehberlik ve meditasyon içerikleri sağlamak.

---

### **3. Hedef Kitle**

* Stres, kaygı veya düşük motivasyon seviyeleriyle başa çıkmak isteyen bireyler.
* Profesyonel terapi desteği alamayan ancak duygusal destek arayan kullanıcılar.
* Günlük ruh halini takip etmek isteyen bireyler.

---

### **4. Özellikler**

#### **4.1. Temel Özellikler**

1. **Duygu Analizi:**

   * Kullanıcının yazdığı metni analiz ederek duygu durumunu belirleme (mutlu, üzgün, öfkeli, kaygılı, vb.).
   * GeminiAPI kullanılarak gelişmiş doğal dil işleme (NLP) algoritmaları uygulanacak.

2. **Motivasyon Mesajları ve Öneriler:**

   * Belirlenen duygu durumuna uygun motive edici veya rahatlatıcı mesajlar sunma.
   * Pratik öneriler: Meditasyon, nefes egzersizleri, olumlama teknikleri.

3. **Duygu Günlükleri:**

   * Kullanıcıların yazılarını kaydedebileceği ve haftalık/aylık duygu durumu analizlerini izleyebileceği bir günlük.

4. **Rehberlik ve Meditasyon:**

   * Stres azaltma, uyku problemleri ve kaygı için özel rehberliğimizle oluşturulmuş meditasyon ve rahatlama içerikleri.

#### **4.2. Ekstra Özellikler**

1. **Kışiselleştirilmiş Destek:**

   * Kullanıcının ruh hali trendlerine dayalı olarak özelleştirilmiş öneriler.

2. **Gizlilik ve Anonimlik:**

   * Kullanıcı verilerini anonim hale getirerek güvenliği sağlama.

3. **Entegrasyon:**

   * Akıllı saat veya fitness takip cihazlarıyla entegrasyon (kalp atış hızı gibi biyometrik verilere dayalı öneriler).

---

### **5. Teknik Detaylar**

#### **5.1. Teknolojiler**

* **Backend:** Node.js, Express.js
* **Frontend:** React/React Native
* **Database:** PostgreSQL (duygu kayıtları için), Redis (cacheleme için)
* **API Entegrasyonu:** GeminiAPI (duygu analizi ve mesaj üretimi için)
* **Bulut Hizmetleri:** AWS Lambda, S3 (dosya depolama)

#### **5.2. Sistem Mimarisi**

1. Kullanıcı Girişi

   * E-posta ve şifre ile oturum açma veya sosyal medya entegrasyonu.

2. API Katmanı

   * GeminiAPI ile metin analizi ve duygu durumunun belirlenmesi.

3. Ön Yüz

   * Kullanıcı dostu bir arayüz (mobile-friendly).

4. Veri Saklama

   * Kullanıcı metinleri, duygu durumu analizleri ve çıktıları PostgreSQL veri tabanında saklanır.

#### **5.3. Kullanılacak Araçlar**

* **Doğal Dil İşleme (NLP):** GeminiAPI
* **Gerçek Zamanlı Veri Analizi:** Socket.IO

---

### **6. Kullanıcı Hikayeleri**

1. **Kullanıcı (Ayşe):** Birçok stresle başa çıkan Ayşe, uygulama üzerinden ruh halini ifade eden bir yazı yazar. Sistem, Ayşe’nin endişeli olduğunu fark eder ve ona nefes alma egzersizi sunar.

2. **Kullanıcı (Ali):** Ali, kendini motive etmek için uygulamaya gönlünce yazılar girer. Sistem, onun olumlu ruh halini desteklemek için bir başarı hikayesi ile geri döner.

---

### **7. Proje Zamanı**

* **Araştırma ve Planlama:** 2 Hafta
* **MVP Geliştirme:** 4 Hafta
* **Test Süreci:** 2 Hafta
* **Lansman:** 1 Hafta

---

### **8. Riskler ve Alternatifler**

* **Risk:** Duygu analizi yanıltıcı olabilir.

  * **Çözüm:** Daha hassas öğrenme modelleriyle test sürecini genişletmek.

* **Risk:** Kullanıcı verilerinin gizliliği.

  * **Çözüm:** End-to-end şifreleme uygulamak.

---

### **9. Sonuç**

Metin Temelli Sanal Terapi, duygusal destek arayan bireylere yenilikçi bir çözüm sunar. Proje, hem bireyler hem de terapistler için dijital psikolojik destek alanında çığır açabilir.
