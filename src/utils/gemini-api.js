const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');
const logger = require('../config/logger');


const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Duygu durumu analizi yap
 * @param {string} text - Analiz edilecek metin
 * @returns {Promise<Object>} Analiz sonuçları
 */
const analyzeMood = async (text) => {
  try {
    
    if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key') {
      logger.warn('Gemini API anahtarı tanımlanmamış. Demo veriler kullanılıyor.');
      return generateMockAnalysis(text);
    }

    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    
    const prompt = `
    Sen deneyimli bir klinik psikolog olarak hizmet vermektesin. Aşağıdaki metni analiz et ve yazarın duygu durumunu belirle.
    
    Metni analiz ederken şunları yap:
    1. Metinden algılanabilir temel duygu durumunu belirle (örn: mutlu, üzgün, kaygılı, öfkeli, nötr, umutlu vs.)
    2. 0 ile 1 arasında bu duygunun yoğunluğunu gösteren bir skor belirle
    3. Metindeki duygu durumuna ilişkin profesyonel bir analiz yaz (2-3 cümle)
    4. Kişiye duygu durumuna özel, bir psikolog üslubuyla sıcak, empatik ve profesyonel bir yanıt ver. Bu yanıt, terapötik teknikler içeren, kişiselleştirilmiş ve detaylı bir metin olmalıdır (en az 150 kelime). Kişiyle sohbet eder gibi samimi fakat profesyonel bir dil kullan.
    
    ÖNEMLİ: Yanıtını doğrudan JSON formatında oluştur, kod bloğu işaretleyicileri (örn. üç ters tırnak) kullanma. Doğrudan JSON çıktısını ver, başka hiçbir açıklama ekleme.
    
    Metin: "${text}"
    
    JSON formatı:
    {
      "moodLabel": "[temel duygu etiketi]",
      "moodScore": [0-1 arası sayısal değer],
      "analysis": "[profesyonel analiz metni]",
      "therapeuticResponse": "[uzun, detaylı, empatik ve terapötik yanıt]"
    }
    `;

    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      
      let cleanedResponse = response;
      cleanedResponse = cleanedResponse.replace(/```json|```/g, '');
      cleanedResponse = cleanedResponse.trim();
      
      
      const analysisData = JSON.parse(cleanedResponse);
      
      
      if (!analysisData.moodLabel || !analysisData.moodScore || !analysisData.analysis || !analysisData.therapeuticResponse) {
        logger.error('Gemini API eksik veri döndürdü', analysisData);
        throw new Error('Eksik analiz verisi');
      }
      
      
      return {
        moodLabel: analysisData.moodLabel,
        moodScore: analysisData.moodScore,
        analysis: analysisData.analysis,
        suggestions: [analysisData.therapeuticResponse]
      };
    } catch (parseError) {
      logger.error('Gemini API yanıtı JSON olarak ayrıştırılamadı: %o', parseError);
      logger.error('Alınan yanıt: %s', response);
      return generateMockAnalysis(text);
    }
  } catch (error) {
    logger.error('Gemini API çağrısı başarısız: %o', error);
    return generateMockAnalysis(text);
  }
};

/**
 * Demo/yedek duygu analizi oluştur
 * @param {string} text - Analiz edilecek metin
 * @returns {Object} Duygu analizi
 */
const generateMockAnalysis = (text) => {
  
  
  
  
  const lowerText = text.toLowerCase();
  let moodLabel = 'nötr';
  let moodScore = 0.5;
  
  const moodPatterns = [
    { keywords: ['mutlu', 'sevinç', 'harika', 'güzel', 'keyif', 'neşe'], mood: 'mutlu', score: 0.85 },
    { keywords: ['üzgün', 'mutsuz', 'kötü', 'hüzün', 'ağla', 'kaybettim'], mood: 'üzgün', score: 0.7 },
    { keywords: ['kaygı', 'endişe', 'korku', 'panik', 'stres', 'gergin'], mood: 'kaygılı', score: 0.75 },
    { keywords: ['öfke', 'kızgın', 'sinir', 'nefret', 'kin', 'bıktım'], mood: 'öfkeli', score: 0.8 },
    { keywords: ['umut', 'gelecek', 'inanıyor', 'başarı', 'olumlu'], mood: 'umutlu', score: 0.75 },
    { keywords: ['yorgun', 'tükenmiş', 'enerjisiz', 'bitkin', 'uyku'], mood: 'yorgun', score: 0.65 }
  ];
  
  
  for (const pattern of moodPatterns) {
    if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
      moodLabel = pattern.mood;
      moodScore = pattern.score + (Math.random() * 0.1 - 0.05); 
      break;
    }
  }
  
  
  const analysis = `Metninizde ${moodLabel} duygu durumuna işaret eden ifadeler var. ` +
                  `Bu duygu durumu yaşamınızın şu anki aşamasında normal olabilir. ` +
                  `Duygularınızı tanımak ve kabul etmek, ruh sağlığınız için önemli bir adımdır.`;
  
  
  let therapeuticResponse = '';
  
  switch (moodLabel) {
    case 'mutlu':
      therapeuticResponse = `Paylaştığınız metinden mutluluk ve memnuniyet duyguları yansıyor, bu harika bir farkındalık. Deneyimlediğiniz bu olumlu duygular, beyninizde dopamin ve serotonin gibi nörotransmitterleri serbest bırakarak hem zihinsel hem de fiziksel sağlığınıza katkıda bulunuyor. Şu anda hissettiğiniz bu mutluluğu daha da derinleştirmek ve kalıcı hale getirmek için, pozitif psikolojinin "anı yakalama" tekniğini kullanmanızı öneririm. Bugün sizi mutlu eden anları, duyguları ve düşünceleri bir günlüğe kaydedin. Bu kayıtlar, ileride zorlu zamanlar yaşadığınızda size destek olacak değerli bir kaynak oluşturacaktır. Ayrıca, bu mutluluğu sevdiklerinizle paylaşmanız, hem ilişkilerinizi güçlendirecek hem de kendi mutluluğunuzu pekiştirecektir. Çünkü psikolojik araştırmalar, olumlu duyguların paylaşıldıkça arttığını gösteriyor. Son olarak, bu pozitif enerjiyi yaratıcı bir aktiviteye yönlendirmeniz, kendinizi ifade etmenin yeni yollarını keşfetmenize ve içsel tatmin duygunuzu artırmanıza yardımcı olabilir. Mutluluğunuzu kutluyor ve bu değerli duygunun sizde uzun süre kalmasını diliyorum.`;
      break;
    case 'üzgün':
      therapeuticResponse = `Metninizden hissettiğiniz üzüntüyü algılıyorum ve öncelikle şunu bilmenizi isterim ki, üzüntü yaşamın doğal ve gerekli bir parçasıdır. Hissettiğiniz duygular tamamen geçerli ve bu duyguları yaşamak için kendinize izin vermek önemli bir adım. Kabul ve Kararlılık Terapisi'nin (ACT) bize öğrettiği gibi, duygularımızla savaşmak yerine onları kabullenmek, paradoksal olarak duygusal acımızı azaltır. Şu anda kendinize karşı nazik olmanız ve öz-şefkat göstermeniz çok değerli. Kendinize, sevdiğiniz bir arkadaşınıza davranacağınız gibi şefkatle yaklaşmayı deneyin. İçinde bulunduğunuz bu duygusal süreçte, fiziksel aktivitenin ruh halinizi iyileştirmedeki rolünü de unutmayın. Kısa bir yürüyüş bile, beyninizdeki endorfin seviyesini artırarak doğal bir ruh hali yükseltici görevi görebilir. Duygularınızı yazıya dökmek veya güvendiğiniz biriyle paylaşmak da terapötik bir etkiye sahiptir. Bu, duygularınızı dışsallaştırmanıza ve onlarla daha sağlıklı bir şekilde başa çıkmanıza yardımcı olur. Unutmayın, her duygu geçicidir ve bu zorlu zamanda yanınızda olduğumu bilmenizi isterim. Kendinize zaman tanıyın ve iyileşme sürecinize saygı gösterin.`;
      break;
    case 'kaygılı':
      therapeuticResponse = `Metninizde kaygı belirtileri fark ediyorum ve öncelikle şunu bilmenizi isterim: kaygı, tehlikeli bir durum karşısında bedenimizin doğal bir tepkisidir ve bir dereceye kadar hayatta kalmamıza yardımcı olur. Bilişsel Davranışçı Terapi perspektifinden baktığımızda, kaygıyı tamamen ortadan kaldırmak yerine onunla ilişkimizi değiştirmek daha etkilidir. Şu anda yaşadığınız kaygı belirtilerini yönetmek için, öncelikle "4-7-8" nefes tekniğini öneririm: 4 saniye boyunca burnunuzdan nefes alın, 7 saniye boyunca nefesinizi tutun ve 8 saniye boyunca ağzınızdan yavaşça verin. Bu teknik, parasempatik sinir sisteminizi aktive ederek "savaş ya da kaç" tepkisini dengelemenize yardımcı olur. Kaygı, genellikle belirsizlikten ve kontrol edemediğimiz durumlardan kaynaklanır. Bu nedenle, endişelerinizi kağıda dökmenizi ve her birinin gerçekçiliğini değerlendirmenizi öneriyorum. Bu egzersiz, düşüncelerinizi netleştirmenize ve daha dengeli bir bakış açısı geliştirmenize yardımcı olacaktır. Şu ana odaklanma (mindfulness) egzersizleri de kaygıyla başa çıkmada etkili bir araçtır. Beş duyunuzu kullanarak bulunduğunuz anı fark etmeye çalışın: gördüğünüz beş şey, duyduğunuz dört şey, dokunduğunuz üç şey, kokladığınız iki şey ve tattığınız bir şey. Bu basit egzersiz, sizi gelecek hakkındaki endişelerden uzaklaştırıp şimdiki ana getirecektir. Kaygı, sizi yalnızca ziyaret eden geçici bir duygudur, sizi tanımlayan bir kimlik değildir. Bu zorlu duyguyla başa çıkma yolculuğunuzda yanınızda olduğumu bilmenizi isterim.`;
      break;
    case 'öfkeli':
      therapeuticResponse = `Metninizde öfke duygusunun izlerini görüyorum ve öncelikle şunu belirtmek isterim: öfke, temel ihtiyaçlarımız veya değerlerimiz tehdit altında olduğunda ortaya çıkan çok doğal bir duygudur. Duygu düzenleme perspektifinden baktığımızda, öfke enerjisini tanımak ve bu enerjiyi yapıcı kanallara yönlendirmek önemlidir. Öfke anında, amigdalanız (beynin duygusal tepkilerden sorumlu bölümü) kontrolü ele geçirir ve prefrontal korteksiniz (mantıklı düşünmeden sorumlu bölüm) geçici olarak devre dışı kalır. Bu nedenle, öncelikle fiziksel tepkilerinizi düzenlemek için "zaman aşımı" tekniğini kullanmanızı öneririm. Mümkünse, öfke uyandıran durumdan geçici olarak uzaklaşın ve bedeninizi sakinleştirmek için derin nefes alın. Psikolog Dr. Marshall Rosenberg'in geliştirdiği Şiddetsiz İletişim modeli, öfkenin altında yatan gerçek ihtiyaçları belirlemenize yardımcı olabilir. Kendinize şu soruları sorun: "Şu anda tam olarak neye ihtiyacım var?", "Bu durumda hangi değerim veya sınırım ihlal edildi?" Bu sorular, öfkenin altında yatan gerçek nedenleri anlamanıza yardımcı olacaktır. Fiziksel aktivite, öfke enerjisini sağlıklı bir şekilde boşaltmanın en etkili yollarından biridir. Yürüyüş, koşu veya yüzme gibi aktiviteler, vücudunuzdaki gerginliği azaltabilir ve endorfin salgılanmasını tetikleyebilir. Öfke duygusunu ifade etmek için günlük tutmak veya ses kaydı yapmak da terapötik olabilir. Bu, duygularınızı zarar vermeden ifade etmenize olanak sağlar. Öfke, bize sınırlarımızı korumamız veya bir durumu değiştirmemiz gerektiğini söyleyen değerli bir işarettir. Bu zorlu duyguyla yolculuğunuzda sizinle birlikteyim.`;
      break;
    case 'umutlu':
      therapeuticResponse = `Metninizden umut ve iyimserlik duygularını algılıyorum, bu harika bir zihinsel durum. Pozitif psikoloji araştırmaları, umudun sadece iyi bir duygu olmakla kalmayıp aynı zamanda psikolojik dayanıklılığın ve başarının önemli bir yordayıcısı olduğunu gösteriyor. Umut, hedeflere ulaşmak için yollar bulma yeteneğini ve bu yolları takip etme motivasyonunu içerir. Şu anki umutlu bakış açınızı somut adımlara dönüştürmek için SMART hedefler tekniğini kullanmanızı öneririm: Spesifik, Ölçülebilir, Ulaşılabilir, Alakalı ve Zaman sınırlı hedefler belirleyin. Bu teknik, büyük hedeflerinizi küçük, yönetilebilir adımlara bölerek ilerleme kaydetmenizi sağlar. Umutlu düşünce, geleceğe yönelik olumlu beklentileri içerir. Bu beklentileri pekiştirmek için görselleştirme tekniğini kullanabilirsiniz. Her gün birkaç dakikanızı, hedeflerinize ulaştığınızı ve hayallerinizin gerçekleştiğini hayal etmeye ayırın. Bu uygulama, beyninizi başarıya programlamaya yardımcı olur. Ayrıca, şükran uygulaması yapmanın umut duygusunu güçlendirdiği bilimsel olarak kanıtlanmıştır. Her gün minnettar olduğunuz üç şeyi yazın. Bu basit alıştırma, olumlu duygularınızı pekiştirir ve zihinsel refahınızı artırır. Umut, zorluklarla karşılaştığımızda bile devam etme gücü verir. Şu anki umut dolu bakış açınızı takdir ediyor ve bu değerli duygunun sizinle kalmasını diliyorum. Umutlu yolculuğunuzda başarılar diliyorum.`;
      break;
    case 'yorgun':
      therapeuticResponse = `Metninizden yorgunluk belirtileri algılıyorum ve öncelikle şunu belirtmek isterim: yorgunluk, vücudunuzun dinlenmeye ihtiyacı olduğunu gösteren önemli bir sinyaldir. Bütüncül sağlık perspektifinden baktığımızda, yorgunluk sadece fiziksel değil, aynı zamanda zihinsel ve duygusal kaynakların da tükendiğini gösterebilir. Kendinize karşı nazik olmak ve bu sinyali ciddiye almak önemlidir. Uyku hijyeni, yorgunlukla mücadelede temel bir faktördür. Yatmadan önce düzenli bir akşam rutini oluşturmanız, kaliteli uykuya geçişi kolaylaştırır. Mavi ışık yayan ekranlardan uzak durmak, yatak odanızı karanlık ve serin tutmak, rahatlatıcı bir aktivite yapmak (kitap okuma, meditasyon gibi) bu rutinin parçası olabilir. Gün içindeki enerji seviyenizi yönetmek için 'enerji bütçeleme' tekniğini kullanabilirsiniz. Bu, sınırlı enerjinizi önceliklerinize göre dağıtmayı içerir. Enerji seviyenizin yüksek olduğu zamanlarda daha zorlu görevleri planlayın ve düşük olduğu zamanlarda dinlenmeye öncelik verin. Kısa molalar (mikro-molalar) almak da gün boyunca enerji seviyenizi korumaya yardımcı olabilir. Pomodoro tekniği (25 dakika çalışma, 5 dakika mola) gibi zaman yönetimi stratejileri, verimliliğinizi artırırken tükenmeyi önlemenize yardımcı olur. Beslenmenizin de enerji seviyeniz üzerinde büyük etkisi vardır. Rafine şekerler ve basit karbonhidratlar yerine kompleks karbonhidratlar, proteinler ve sağlıklı yağlar içeren dengeli öğünler tercih edin. Yeterli su tüketimi de yorgunluğu azaltmada kritik öneme sahiptir. Yorgunluk bazen altta yatan tıbbi durumların bir belirtisi olabilir, bu nedenle uzun süreli yorgunluk yaşıyorsanız bir sağlık uzmanına danışmanızı öneririm. Kendinize nazik davranın ve iyileşme sürecinize saygı gösterin. Bu zorlu dönemde yanınızda olduğumu bilmenizi isterim.`;
      break;
    default:
      therapeuticResponse = `Metninizi okudum ve duygusal durumunuzu değerlendirdim. Duyguları tanımak ve kabul etmek, duygusal zekânın ve psikolojik sağlığın önemli bir parçasıdır. Duygusal farkındalık, Kabul ve Kararlılık Terapisi'nin (ACT) temel ilkelerinden biridir ve bu farkındalık, duygularınızla daha sağlıklı bir ilişki kurmanıza yardımcı olabilir. Günlük tutmak, duygusal farkındalığınızı artırmanın etkili bir yoludur. Her gün birkaç dakikanızı düşüncelerinizi ve duygularınızı kaydetmeye ayırın. Bu uygulama, zaman içinde duygusal örüntülerinizi fark etmenize ve tetikleyicileri belirlemenize yardımcı olacaktır. Doğada zaman geçirmenin zihinsel ve duygusal sağlık üzerindeki olumlu etkileri bilimsel olarak kanıtlanmıştır. "Doğa terapisi" veya "orman banyosu" olarak da bilinen bu uygulama, stres hormonlarını azaltır, dikkati artırır ve genel ruh halini iyileştirir. Mümkünse, günde en az 20 dakikanızı doğada geçirmeye çalışın. Nefes egzersizleri ve mindfulness (bilinçli farkındalık) uygulamaları, duygusal dengeyi sağlamada etkili tekniklerdir. Basit bir nefes egzersizi: yavaşça 4'e kadar sayarak nefes alın, 7'ye kadar sayarak nefesinizi tutun ve 8'e kadar sayarak nefes verin. Bu teknik, sempatik sinir sisteminizi (stres tepkisi) yavaşlatır ve parasempatik sinir sisteminizi (rahatlama tepkisi) aktive eder. Duygular, sürekli değişen ve geçici durumlardır. Kendinize karşı nazik olun ve duygusal deneyimlerinizin doğal akışına izin verin. Bu süreçte size destek olmaktan memnuniyet duyarım.`;
  }
  
  return {
    moodLabel,
    moodScore,
    analysis,
    suggestions: [therapeuticResponse]
  };
};

module.exports = {
  analyzeMood
}; 