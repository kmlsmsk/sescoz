# 🎙️ Akıllı Ses Asistanı | Çözümleyici (Web Uygulaması)

Bu proje, ses dosyalarınızı veya anlık mikrofon kayıtlarınızı yapay zeka (Google Gemini API) kullanarak yüksek doğrulukla metne dönüştüren, aynı zamanda metindeki dil bilgisi hatalarını düzelterek iyileştiren tarayıcı tabanlı bir web uygulamasıdır.

Orijinalinde bir Chrome Uzantısı olarak tasarlanan bu araç, hiçbir sunucu bağımlılığı olmadan (tamamen istemci tarafında) çalışacak şekilde standart bir Web Uygulamasına dönüştürülmüştür.

## ✨ Özellikler

- **📁 Sürükle ve Bırak:** Cihazınızdaki ses veya video dosyalarını kolayca yükleyin.
- **🎤 Mikrofon Kaydı:** Tarayıcı üzerinden doğrudan ses kaydedin ve anında deşifre edin.
- **⚙️ Dinamik Ses Sıkıştırma (Web Audio API):** Yüklenen dosyalar, 20 dakikalık uzunluğa kadar olan sesleri Gemini API'nin 20 MB sınırına takılmadan otomatik olarak optimize eder (Dinamik Resampling).
- **🤖 Yapay Zeka ile İyileştirme:** Ses sadece metne dökülmez; anlam bozuklukları, yazım ve noktalama hataları yapay zeka tarafından düzeltilerek profesyonel bir metin sunulur.
- **🔒 Gizlilik Odaklı:** API anahtarınız sunuculara gönderilmez, sadece tarayıcınızın `localStorage` belleğinde tutulur.
- **💾 Dışa Aktarma:** Sonuçları tek tıkla panoya kopyalayın veya `.txt` formatında bilgisayarınıza indirin.
- **🪟 Özelleştirilebilir Arayüz:** Sürüklenebilir, küçültülebilir ve şık yüzen pencere tasarımı.

## 🚀 Kurulum ve Canlı Yayın (Render)

Bu uygulama tamamen statik HTML, CSS ve JavaScript'ten oluşur. Node.js veya herhangi bir backend sunucusuna ihtiyaç duymaz.

### Yerel Ortamda Çalıştırma
1. Bu depoyu bilgisayarınıza indirin veya klonlayın:
   ```bash
   git clone https://github.com/kmlsmsk/sesanaliz.git


## 📁 Dosya Yapısı

Projenin sorunsuz çalışması için herhangi bir sunucu veya Node.js kurulumuna gerek yoktur. Temel dosya yapısı şu şekildedir:

```text
📂 proje-klasoru/
├── 📄 index.html      # Ana web sayfası (Uygulamanın çalışacağı iskelet yapı)
├── 📄 app.js          # Tüm ses işleme, Gemini API ve dinamik arayüz mantığı
└── 📄 README.md       # Proje dokümantasyonu (Bu dosya)
