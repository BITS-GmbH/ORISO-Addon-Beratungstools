import type { Catalogue } from './types.ts';

export const tr: Catalogue = {
	common: {
		saving: 'Kaydediliyor …',
		saved: 'Otomatik olarak kaydedildi',
		notSaved: 'Kaydedilmedi',
		weekBack: 'Önceki hafta',
		weekForward: 'Sonraki hafta',
		tryLater: 'Lütfen daha sonra tekrar deneyin.',
		tryAgain: 'Bu işlem başarısız oldu. Lütfen tekrar deneyin.',
		cancel: 'İptal'
	},
	days: {
		period: '{from} – {to}',
		minutes: '{minutes} dk.',
		hours: '{hours} sa.',
		hoursMinutes: '{hours} sa. {minutes} dk.',
		time: 'saat {time}'
	},
	catalog: {
		goals: {
			title: 'Başlangıç durumu ve hedefler',
			summary: 'Durumu anlatın ve danışmanlık için bir hedef belirleyin',
			description:
				'Bu araç, mevcut durumu kendi sözlerinizle anlatmanızı ve danışmanlık için somut bir hedef belirlemenizi sağlar. Kişisel hedefi açıkça adlandırmak, durumunu iyileştirmek için çalışan kişiye yardımcı olur. Aynı zamanda danışmana, danışmanlık sürecini uygun şekilde planlamak için daha fazla olanak ve başlangıç noktası sunar. Kişisel hedef, danışmanlık süresince değiştirilebilir.'
		},
		'consumption-diary': {
			title: 'Kullanım günlüğü',
			summary: 'Madde kullanımını veya kumar oynamayı gün gün kaydedin',
			description:
				'Kullanım günlüğünde kişiler madde kullanımlarını ve/veya kumar oynama davranışlarını kaydedebilir. Buna kullanımın veya kumar oynamanın sıklığı, miktarı ve süresi, ayrıca bağımlılık davranışıyla bağlantılı düşünce ve duygular da dahildir. Kişiler günlüğü danışmanlarıyla paylaşmak isterlerse, danışman kayıtlara geri bildirim verebilir.'
		},
		'relatives-diary': {
			title: 'Yakınlar için günlük',
			summary: 'Günü üç soru ve bir ruh hâli ile değerlendirin',
			description:
				'Bu günlük, yakınlara günün yaşantılarını üç soru yardımıyla düşünme olanağı verir. Sorular, yakınlarının bağımlılık davranışıyla ilgili kendi düşünce ve duygularını anlamlandırmalarına ve yazmalarına yardımcı olur. Yakınlar günlüğü danışmanlarıyla paylaşırsa, danışman kayıtlara geri bildirim verebilir.'
		},
		balance: {
			title: 'Motivasyon terazisi',
			summary: 'Bir değişikliğin artılarını ve eksilerini tartın',
			description:
				'Motivasyon terazisi, kişilerin bağımlılık davranışını bırakmanın artılarını ve eksilerini tartmalarına ve önem sırasına koymalarına yardımcı olur. Böylece belirsizlikler ve kaygılar ortaya çıkabilir ve kararlar daha net verilebilir. Kişiler isterlerse notlarını danışmanlarıyla paylaşabilir; böylece danışman kişisel değerlendirmelere özel olarak değinebilir.'
		},
		'emergency-kit': {
			title: 'Acil durum çantası',
			summary: 'Zor durumlar için stratejiler ve iletişim bilgileri',
			description:
				'Bu araçla kişiler, özellikle zor durumlarda nüksü önlemeye yardımcı olan kişisel acil durum çantalarını hazırlayabilir. Acil durum çantasına danışmanların veya yakınların iletişim bilgileri, somut yapılacaklar ve akılda tutulacak cümleler eklenebilir.'
		},
		active: {
			title: 'Aktif olmak',
			summary: 'Hoş etkinlikler planlayın, düzenli olarak da',
			description:
				'Bu araç, kişilerin yaşam kalitesini artırmak ve yoğun madde isteğini (craving) azaltmak için günlük hayatlarını hoş etkinliklerle olumlu biçimde düzenlemelerine yardımcı olur. Etkinlikler serbestçe yazılabilir veya öneri listesinden seçilebilir; bir kez ya da düzenli olarak planlanabilir.'
		},
		'risk-situations': {
			title: 'Risk durumları ve kontrol stratejileri',
			summary: 'Risk durumlarını, stratejileri ve nüksleri kaydedin',
			description:
				'Bu araçla kişiler kendi risk durumlarını yakından inceleyebilir ve uygun kontrol stratejileri geliştirebilir. Nüks olursa bu kaydedilebilir ve stratejiler gözden geçirilebilir. Kişiler isterlerse notlarını danışmanlarıyla paylaşabilir; böylece danışman risk durumlarına ve kontrol stratejilerine özel olarak değinebilir.'
		},
		'traffic-light': {
			title: 'Trafik ışığı modeli',
			summary: 'Medya etkinliklerini risklerine göre sınıflandırın',
			description:
				'Trafik ışığı modeli, kişilerin tek tek medya etkinliklerinin kendileri için ne kadar riskli olduğunu değerlendirmelerine ve medyayı sağlıklı kullanma becerilerini güçlendirmelerine yardımcı olur. Medya etkinlikleri, bir trafik ışığında olduğu gibi “yeşil” (zararsız), “sarı” (riskli) ve “kırmızı” (çok riskli) olarak sınıflandırılabilir.'
		},
		'positive-perception': {
			title: 'Olumluyu fark etmek',
			summary: 'Ebeveynler için: çocuğun davranışındaki olumlu yanları görmek',
			description:
				'Bu araç, ebeveynlerin çocuklarıyla etkileşimlerini ve iletişimlerini iyileştirmek için çocuklarının davranışlarındaki olumlu yanları daha bilinçli fark etmelerine yardımcı olur. Olumsuz iletişimin risklerini ve olumlu pekiştireçlerin çocuğun duyguları ve davranışı üzerindeki etkisini anlatır. Ebeveynler övgüyü nasıl kullandıklarını düşünebilir ve olumlu iletişimi planlayabilir.'
		}
	},
	client: {
		myTools: 'Araçlarım',
		intro:
			'Danışmanınız bu alıştırmaları sizin için kullanıma açtı. Yazdıklarınızı danışmanınız yalnızca siz paylaşırsanız görebilir.',
		loadError: 'Araçlarınız yüklenemedi.',
		noneTitle: 'Henüz kullanıma açılmış araç yok',
		noneText:
			'Danışmanınız sizin için araçları kullanıma açabilir. Bu konuyu danışmanınıza sormaktan çekinmeyin.',
		new: 'Yeni',
		shared: 'Danışmanınızla paylaşıldı',
		continue: 'Devam et',
		open: 'Aç'
	},
	toolPage: {
		loadError: '“{title}” yüklenemedi.',
		notReleased: 'Bu araç artık kullanıma açık değil.',
		notReleasedNotSaved: 'Bu araç artık kullanıma açık değil. Girdiğiniz bilgiler kaydedilmedi.',
		saveFailed: 'Kaydetme başarısız oldu. Lütfen tekrar deneyin.',
		pdfFailed: 'PDF oluşturulamadı. Lütfen tekrar deneyin.',
		sharedNow: 'Danışmanınız artık bu içerikleri görebilir.',
		privateAgain: 'İçerikler artık yine yalnızca sizin tarafınızdan görülebilir.',
		shareOverline: 'Danışmanınız için görünürlük',
		shareLabel: 'Danışmanımla paylaş',
		shareOn: 'Danışmanınız kayıtlarınızı görebilir ve yeni kayıtlarınızdan haberdar edilir.',
		shareOff: 'Kayıtlarınızı yalnızca siz görebilirsiniz.',
		notAvailable: 'Bu araç henüz kullanılamıyor.'
	},
	counsellor: {
		loadError: 'Bu vakanın araçları yüklenemedi.',
		openFromCase: 'Lütfen araçları bir vakanın içinden açın.',
		tools: 'Araçlar',
		released: 'Kullanıma açık',
		releasedTools: 'Kullanıma açılmış araçlar',
		notReleasedYet: 'Henüz kullanıma açılmadı',
		notReleasedTools: 'Henüz kullanıma açılmamış araçlar',
		noTools: 'Bu danışmanlık merkezi için hiçbir araç etkinleştirilmemiş.',
		shared: 'Görüntüleme izni verildi',
		entriesNotShared: 'Kayıt var, görüntüleme izni yok',
		noEntries: 'Henüz kayıt yok',
		newEntries: { one: '{count} yeni kayıt', other: '{count} yeni kayıt' },
		dpa: 'Şu anda kullanıma açmak mümkün değil: Kurum, güncel veri işleme sözleşmesini henüz onaylamadı.',
		releasedOn: 'Kullanıma açılma tarihi: {date}',
		lastChangedOn: 'son düzenleme: {date}',
		allTools: 'Tüm araçlar',
		notReleased: 'Kullanıma açılmadı',
		release: 'Kullanıma aç',
		releasedNotice: '“{title}” kullanıma açıldı. Danışana bildirim gönderilecek.',
		viewEntries: 'Kayıtları görüntüle',
		preview: 'Kullanıcı önizlemesi',
		withdraw: 'Kullanıma açmayı geri al',
		previewHint: 'Kullanıcı önizlemesi, aracı danışanın gördüğü şekilde, test verileriyle gösterir.',
		withdrawConfirm:
			'Kullanıma açma geri alınsın mı? Araç danışan için kaybolur ve siz artık hiçbir içerik göremezsiniz. Kayıtlar saklanmaya devam eder.',
		withdrawButton: 'Geri al',
		withdrawn: 'Kullanıma açma geri alındı. Kayıtlar saklanmaya devam ediyor.'
	},
	entries: {
		back: 'Genel bakışa dön',
		noAccess: 'Görüntüleme izni yok',
		loadError: 'Kayıtlar yüklenemedi.',
		revoked: 'Danışan görüntüleme iznini geri aldı ya da araç artık kullanıma açık değil.',
		exportRevoked: 'Danışan görüntüleme iznini geri aldı. Dışa aktarma mümkün değil.',
		exportFailed: 'Dışa aktarma başarısız oldu. Lütfen tekrar deneyin.',
		readOnly: 'Kayıtlar, salt okunur',
		lastChangedOn: 'Son düzenleme: {date}',
		noEntries: 'Henüz kayıt yok',
		sharedSince: 'Görüntüleme izni verildiği tarih: {date}',
		exporting: 'Dışa aktarma hazırlanıyor …',
		createExport: 'Dışa aktar',
		exportPdf: 'PDF olarak dışa aktar',
		noView: 'Bu araç için henüz bir görünüm yok.'
	},
	demo: {
		resetFailed: 'Demo sıfırlanamadı.',
		banner: 'Kullanıcı önizlemesi / demo: gerçek vakaya hiçbir şey kaydedilmez',
		bannerText:
			'Danışanlar aracı bu şekilde görür. Burada girdiğiniz bilgiler test verileridir, tüm vakalardan ayrı tutulur ve siz demoyu sıfırlayana kadar sizin için saklanır.',
		reset: 'Demoyu sıfırla',
		end: 'Önizlemeyi bitir'
	},
	prefs: {
		button: 'Bildirimler',
		saved: 'Bildirim ayarlarınız kaydedildi.',
		saveFailed: 'Ayarlar kaydedilemedi.',
		title: 'Bildirim ayarları',
		intro:
			'Danışanlar araçlarını sizinle paylaştığında hangi konularda bilgilendirilmek istersiniz? Bu, tüm vakalarınız için geçerlidir. Kısa süre içinde yapılan birden fazla değişiklik tek bildirimde toplanır.',
		firstShare: 'Araç içeriklerinin ilk kez paylaşılması',
		newEntry: 'Paylaşılan araçlardaki yeni kayıtlar',
		changedEntry: 'Mevcut kayıtlardaki değişiklikler',
		save: 'Ayarları kaydet'
	},
	profile: {
		loadError: 'Araçlar yüklenemedi.',
		none: 'Henüz kullanıma açılmış araç yok.',
		newCount: '{count} yeni',
		shared: 'Görüntüleme izni verildi',
		notShared: 'Görüntüleme izni yok',
		open: 'Araçları vakada aç'
	},
	rangePicker: {
		label: 'Dönem',
		all: 'Tüm kayıtlar',
		from: 'başlangıç: {day}',
		until: 'bitiş: {day}',
		choose: '{label} seçin',
		quick: 'Hızlı seçim',
		thisWeek: 'Bu hafta',
		lastFourWeeks: 'Son 4 hafta',
		previousMonth: 'Önceki ay',
		nextMonth: 'Sonraki ay',
		pickFirst: 'Dönemin ilk gününü seçin.',
		pickLast: 'Başlangıç: {day}. Şimdi son günü seçin.'
	},
	planned: {
		title: 'Bu hafta planlanan etkinlikler',
		none: 'Bu hafta için planlanmış etkinlik yok.',
		plan: '“Aktif olmak” aracında etkinlik planlayın',
		with: 'birlikte: {name}'
	},
	pdf: {
		brand: 'Danışmanlık araçları',
		case: 'Vaka',
		createdAt: 'Dışa aktarma tarihi',
		period: 'Kayıtların dönemi',
		confidential:
			'Gizli. Danışanın görüntülenmesine izin verdiği içerikler; yalnızca danışmanlık kapsamında kullanılmak içindir.',
		personal: 'Danışmanlık araçlarından kişisel belge.',
		page: 'Sayfa {page} / {pages}',
		caseLabel: 'Vaka {id}',
		caseWithoutId: 'Kimliği olmayan vaka',
		noEntries: 'Kayıt yok',
		fileCase: 'vaka'
	},
	notifications: {
		someone: 'Bir danışan',
		sharedTitle: 'Araç görüntülemenize açıldı',
		entriesTitle: 'Bir araçta yeni kayıtlar',
		shared: '{who}, “{tool}” aracını görüntülemenize açtı.',
		sharedAnd: '{who}, “{tool}” aracını görüntülemenize açtı ve bu araçta {what}.',
		changes: '{who}, “{tool}” aracında {what}.',
		added: 'yeni kayıtlar ekledi',
		changed: 'kayıtları değiştirdi',
		addedAndChanged: 'yeni kayıtlar ekledi ve kayıtları değiştirdi',
		releasedTitle: 'Yeni araç kullanıma açıldı',
		released: '“{tool}” artık “Araçlarım” bölümünde kullanılabilir.'
	},
	audit: {
		released: '“{tool}” aracı kullanıma açıldı',
		withdrawn: '“{tool}” aracının kullanıma açılması geri alındı',
		exported: '“{tool}” aracındaki kayıtlar PDF olarak dışa aktarıldı',
		shared: '“{tool}” aracı görüntülemeye açıldı',
		unshared: '“{tool}” aracının görüntüleme izni geri alındı'
	},
	manifest: {
		title: 'Araçlar',
		description:
			'Dijital danışmanlık araçları: Danışmanlar alıştırmaları kullanıma açar, danışanlar bunlar üzerinde çalışır ve isterlerse danışmanlarıyla paylaşır.',
		screenshotOverview: 'Vakadaki araçlara genel bakış',
		screenshotEntries: 'Paylaşılan kayıtlar, salt okunur',
		screenshotBalance: 'Danışanın motivasyon terazisi',
		statReleased: '{tool}: kullanıma açıldı',
		statStarted: '{tool}: üzerinde çalışıldı',
		statShared: '{tool}: paylaşıldı'
	},
	goals: {
		steps: {
			situation: {
				section: 'Mevcut durum',
				title: 'Soru 1 / 4: Mevcut durumunuz nasıl?',
				hint: [
					'Lütfen kısaca anlatın:',
					'• kendi madde kullanımınızı veya kumar oynama davranışınızı ya da',
					'• madde kullanan / kumar oynayan bir yakınınızla ilişkinizdeki temel konuları veya çatışmaları.'
				],
				summary: 'Mevcut durumunuz',
				counsellorLabel: 'Mevcut durum'
			},
			factors: {
				section: 'Durumu sürdüren etkenler',
				title: 'Soru 2 / 4: Mevcut durumun olumlu yanları neler?',
				hint: [
					'Madde kullanımının, kumar oynamanın veya medya kullanımının sizin için olumlu etkileri neler? Sizce madde kullanırken veya oynarken hangi nedenler rol oynuyor? Mevcut durumu değiştirmemek için hangi nedenler olabilir?'
				],
				summary: 'Değişimi zorlaştıran etkenler',
				counsellorLabel: 'Değişimi zorlaştıran etkenler'
			},
			motivation: {
				section: 'Değişim motivasyonu',
				title: 'Soru 3 / 4: Mevcut durumda neden bir şeyleri değiştirmek istiyorsunuz?',
				hint: ['Sizi rahatsız eden veya yoran ne? Hangi şeyler istediğiniz gibi gitmiyor?'],
				summary: 'Durumu değiştirmek için nedenler ve güdüler',
				counsellorLabel: 'Durumu değiştirmek için nedenler ve güdüler'
			},
			resources: {
				section: 'Kişisel güçlü yanlar',
				title: 'Soru 4 / 4: Bu niyetinizde size kim veya ne yardımcı olabilir?',
				hint: [
					'Sizi oyalayan hobileriniz ya da size destek olabilecek arkadaşlarınız / yakınlarınız var mı?'
				],
				summary: 'Kişisel güçlü yanlarınız',
				counsellorLabel: 'Kişisel güçlü yanlar'
			},
			goal: {
				section: 'Hedef belirleme',
				title: 'Başlamadan önce: Hedefinizi belirleyin',
				hint: [
					'Önümüzdeki haftalarda durumunuzu iyileştirmek için kararlılıkla çalışabilmeniz için kişisel hedefinizi olabildiğince açık bir şekilde adlandırmanız önemlidir. Önümüzdeki haftalarda neyi başarmak istiyorsunuz? Danışmanlık size hangi konuda destek olmalı?',
					'Hangi somut hedefe ulaşmak istiyorsunuz? (Cevabınızı daha sonra da değiştirebilirsiniz.)'
				],
				summary: 'Kişisel hedefiniz',
				counsellorLabel: 'Kişisel hedef'
			}
		},
		start:
			'Lütfen aşağıdaki soruların yardımıyla mevcut durumunuzu anlatın. Bunu yaparken danışmanlığa başvurma nedeninizi düşünün. Cevaplarınız, hangi alıştırmaların sizin için özellikle yararlı olacağını değerlendirmeye yardımcı olur. Danışmanınızın geri bildirimleri de böylece gerçek durumunuza daha iyi yanıt verebilir.',
		startButton: 'Başlayalım',
		summaryTitle: 'Özet',
		summaryText:
			'Mevcut durumunuzu ayrıntılı olarak ele aldınız ve somut bir hedef belirlediniz. Bu, durumu iyileştirmeye yönelik önemli bir ilk adımdır. Gerekirse bilgilerinizi istediğiniz zaman düzenleyebilirsiniz. Bu konuda size memnuniyetle destek olurum.',
		overview: 'Bilgilerinize genel bakış:',
		edit: 'Düzenle',
		editLabel: 'Düzenle: {label}',
		empty: 'Henüz bilgi yok',
		restart: 'Baştan yeniden geç',
		home: 'Ana sayfam',
		autosave: 'Bilgileriniz otomatik olarak kaydedilir.',
		back: 'Geri',
		toSummary: 'Özete git',
		next: 'İleri',
		new: 'Yeni',
		lastChanged: 'Son değişiklik: {date}',
		noAnswer: 'Bilgi yok',
		noAnswers: 'Henüz cevap yok.',
		reminder: 'Başlangıç durumu ve hedefleri doldurun',
		demoSituation: 'Birkaç aydır neredeyse her akşam içiyorum, genellikle iki üç bira.'
	},
	consumptionDiary: {
		intro:
			'Günlük, hedeflediğiniz davranış değişikliğiyle ilgili her şeyi her gün not etmek içindir. Düzenli olarak devam etmeniz ve ilgili tüm düşünce ve duygularınızı günlüğe ayrıntılı olarak yazmanız önemlidir. Bu, hedefinize ulaşmanıza yardımcı olur! Danışmanınız durumunuzu ne kadar iyi anlarsa, size o kadar iyi danışmanlık yapılabilir. Bu nedenle kayıtlarınızı danışmanınızın görebileceği şekilde paylaşmanızı öneririz.',
		about: 'Kullanım günlüğü hakkında',
		nav: {
			label: 'Kullanım günlüğü',
			week: 'Haftam',
			entry: 'Günlük kaydı',
			settings: 'Ayarlar'
		},
		settings: {
			title: 'Şu konuları kaydet:',
			addTopic: 'başka bir konu ekle',
			pickTopic: 'Lütfen en az bir konu seçin.',
			save: 'Kaydet',
			start: 'Günlüğü başlat'
		},
		newEntry: {
			title: 'Günlük kaydı',
			date: 'Tarih',
			add: 'Kayıt ekle: {topic}'
		},
		week: {
			title: 'Haftam',
			cell: '{day}: {question}'
		},
		yes: 'evet',
		no: 'hayır',
		day: {
			back: 'Haftalık görünüme dön',
			overline: 'Günlük | {topic}',
			deleteAll: 'Kayıtları sil',
			cancel: 'İptal',
			moreAfterYes: 'daha fazla bilgi',
			moreAfterNo: 'Daha fazla bilgi',
			logged: 'Bu gün için kaydedilenler:',
			noPhase: 'henüz kayıt yok',
			delete: 'Sil',
			editTitle: 'düzenle',
			deleteTitle: 'sil',
			summary: 'Günün özeti',
			ratingHint:
				'Bugün neyi iyi başardınız? Ne o kadar iyi gitmedi? Bunu yaparken kişisel hedefinizi düşünün.',
			planQuestion: 'Yarın için ne planlıyorsunuz?',
			done: 'Bitti',
			save: 'kaydet'
		},
		phase: {
			back: 'Günlük görünüme dön',
			date: 'Tarih',
			start: 'Saat (başlangıç)',
			end: 'Saat (bitiş)',
			nothingYet: 'Henüz bir şey girilmedi.',
			deleteItem: 'Kaydı sil',
			deleteItemLabel: 'Kaydı sil: {item}',
			deviceQuestion:
				'Hangi cihazı kullandınız? (ör. bilgisayar, akıllı telefon, oyun konsolu / taşınabilir oyun cihazı)',
			missingItem: 'Lütfen en az bir bilgi girin ve “ekle” düğmesine tıklayın.',
			choose: 'Lütfen seçin',
			group: '{group}:',
			drink: 'İçecek',
			size: 'Miktar',
			count: 'Adet',
			joints: 'Joint',
			bongs: 'Bong',
			otherKind: 'Diğer',
			gambling: 'Kumar',
			media: 'Medya',
			hours: 'Süre: saat',
			minutes: 'Dakika',
			add: 'ekle',
			cancel: 'İptal',
			timeRange: 'saat {start} ile {end} arası',
			time: 'saat {time}',
			when: '{time}:',
			noItems: 'Kullanımla ilgili bilgi yok'
		},
		topics: {
			alcohol: {
				label: 'Alkol',
				weekQuestion: 'Alkol içtiniz mi?',
				dayQuestion: 'Bugün alkol içtiniz mi?',
				pastDayQuestion: 'Bu gün alkol içtiniz mi?',
				ratingQuestion: 'Alkol kullanımınız açısından bugünü nasıl değerlendiriyorsunuz?',
				pastRatingQuestion: 'Alkol kullanımınız açısından bu günü nasıl değerlendiriyorsunuz?',
				planHint:
					'Ertesi gün için kendinize bir görev ya da küçük bir hedef koyuyor musunuz? (Örnek: içmemek, bir işi halletmek, güzel bir şey yapmak vb.)',
				yesIntro:
					'Alkol kullanımınızı buraya kaydedin. Lütfen her kullanım durumu / kullanım dönemi için yeni bir kayıt oluşturun.',
				yesMore:
					'Örneğin hem öğlen hem de akşam içtiyseniz iki kayıt oluşturun. Belirli bir zaman aralığında birden fazla içecek içtiyseniz bunu tek bir kullanım dönemi olarak girebilirsiniz. Günlüğün amacı, kullanım davranışınızı danışmanınızla birlikte olabildiğince iyi anlamanız ve böylece onu başarıyla değiştirebilmenizdir.',
				noIntro:
					'Bugün hiç alkol içmediniz mi? Harika! Ayık kalmanıza neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				pastNoIntro:
					'Bu gün hiç alkol içmediniz mi? Harika! Ayık kalmanıza neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				noMore:
					'Belki kontrol stratejilerinizi başarıyla uygulayabildiniz? Günlükteki notlarınız, kalıcı bir davranış değişikliği ve ayık bir yaşam için özellikle başarılı stratejileri sizin ve danışmanınızın fark etmesine yardımcı olur. Bir şey yazmak istemiyorsanız “kaydet” düğmesine tıklamanız yeterli.',
				contextQuestion: 'Kimlerle ve nerede içtiniz?',
				triggerQuestion: 'Neden? Kullanımın nedeni / tetikleyicisi neydi?',
				phaseTitle: 'Alkol: kullanım dönemi ekle',
				newPhase: 'yeni kullanım dönemi ekle',
				editPhase: 'Kullanım dönemini düzenle',
				deletePhase: 'Kullanım dönemini sil',
				deletePhaseQuestion: 'Bu kullanım dönemi silinsin mi?',
				deleteAllQuestion: 'Bu gün için girilen tüm kullanım dönemleri silinecek. Yine de devam edilsin mi?',
				saveLabel: 'Kullanım dönemini kaydet',
				loggedLabel: 'Kaydedilen içecekler:'
			},
			cannabis: {
				label: 'Esrar',
				weekQuestion: 'Esrar kullandınız mı?',
				dayQuestion: 'Bugün esrar kullandınız mı?',
				pastDayQuestion: 'Bu gün esrar kullandınız mı?',
				ratingQuestion: 'Esrar kullanımınız açısından bugünü nasıl değerlendiriyorsunuz?',
				pastRatingQuestion: 'Esrar kullanımınız açısından bu günü nasıl değerlendiriyorsunuz?',
				planHint:
					'Ertesi gün için kendinize bir görev ya da küçük bir hedef koyuyor musunuz? (Örnek: esrar içmemek, bir işi halletmek, güzel bir şey yapmak vb.)',
				yesIntro:
					'Esrar kullanımınızı buraya kaydedin. Lütfen her kullanım durumu / kullanım dönemi için yeni bir kayıt oluşturun.',
				yesMore:
					'Örneğin hem öğlen hem de akşam esrar içtiyseniz iki kayıt oluşturun. Belirli bir zaman aralığında birkaç kez kullandıysanız bunu tek bir kullanım dönemi olarak girebilirsiniz. Günlüğün amacı, kullanım davranışınızı danışmanınızla birlikte olabildiğince iyi anlamanız ve böylece onu başarıyla değiştirebilmenizdir.',
				noIntro:
					'Bugün hiç kullanmadınız mı? Harika! Ayık kalmanıza neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				pastNoIntro:
					'Bu gün hiç kullanmadınız mı? Harika! Ayık kalmanıza neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				noMore:
					'Belki kontrol stratejilerinizi başarıyla uygulayabildiniz? Günlükteki notlarınız, kalıcı bir davranış değişikliği ve ayık bir yaşam için özellikle başarılı stratejileri sizin ve danışmanınızın fark etmesine yardımcı olur. Bir şey yazmak istemiyorsanız “kaydet” düğmesine tıklamanız yeterli.',
				contextQuestion: 'Kimlerle ve nerede esrar içtiniz?',
				triggerQuestion: 'Neden? Kullanımın nedeni / tetikleyicisi neydi?',
				phaseTitle: 'Esrar: kullanım ekle',
				newPhase: 'yeni kullanım dönemi ekle',
				editPhase: 'Kullanım dönemini düzenle',
				deletePhase: 'Kullanım dönemini sil',
				deletePhaseQuestion: 'Bu kullanım dönemi silinsin mi?',
				deleteAllQuestion: 'Bu gün için girilen tüm kullanım dönemleri silinecek. Yine de devam edilsin mi?',
				saveLabel: 'Kullanım dönemini kaydet',
				loggedLabel: 'Kaydedilen kullanım:'
			},
			gambling: {
				label: 'Kumar',
				weekQuestion: 'Kumar oynadınız mı?',
				dayQuestion: 'Bugün kumar oynadınız mı?',
				pastDayQuestion: 'Bu gün kumar oynadınız mı?',
				ratingQuestion: 'Kumar oynama davranışınız açısından bugünü nasıl değerlendiriyorsunuz?',
				pastRatingQuestion: 'Kumar oynama davranışınız açısından bu günü nasıl değerlendiriyorsunuz?',
				planHint:
					'Ertesi gün için kendinize bir görev ya da küçük bir hedef koyuyor musunuz? (Örnek: kumar oynamamak, bir işi halletmek, güzel bir şey yapmak vb.)',
				yesIntro:
					'Kumar oynama davranışınızı buraya kaydedin. Lütfen kumar oynadığınız her dönem için yeni bir kayıt oluşturun.',
				yesMore:
					'Örneğin hem öğlen hem de akşam kumar oynadıysanız iki kayıt oluşturun. Belirli bir zaman aralığında birden fazla kumar türü oynadıysanız bunları tek bir oyun dönemi olarak girebilirsiniz. Günlüğün amacı, davranışınızı danışmanınızla birlikte olabildiğince iyi anlamanız ve böylece onu başarıyla değiştirebilmenizdir.',
				noIntro:
					'Bugün hiç kumar oynamadınız mı? Harika! Kumarsız kalmanıza neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				pastNoIntro:
					'Bu gün hiç kumar oynamadınız mı? Harika! Kumarsız kalmanıza neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				noMore:
					'Belki kontrol stratejilerinizi başarıyla uygulayabildiniz? Günlükteki notlarınız, kalıcı bir davranış değişikliği ve kumarsız bir yaşam için özellikle başarılı stratejileri sizin ve danışmanınızın fark etmesine yardımcı olur. Bir şey yazmak istemiyorsanız “kaydet” düğmesine tıklamanız yeterli.',
				contextQuestion: 'Nerede ve kimlerle kumar oynadınız?',
				triggerQuestion: 'Neden? Kumar oynamanın nedeni / tetikleyicisi neydi?',
				phaseTitle: 'Kumar ekle',
				newPhase: 'yeni oyun dönemi ekle',
				editPhase: 'Oyun dönemini düzenle',
				deletePhase: 'Oyun dönemini sil',
				deletePhaseQuestion: 'Bu oyun dönemi silinsin mi?',
				deleteAllQuestion: 'Bu gün için girilen tüm oyun dönemleri silinecek. Yine de devam edilsin mi?',
				saveLabel: 'Kaydı kaydet',
				loggedLabel: 'Kaydedilen kumar oyunları:'
			},
			media: {
				label: 'Medya',
				weekQuestion: 'Medya kullandınız mı?',
				dayQuestion: 'Bugün medya kullandınız mı?',
				pastDayQuestion: 'Bu gün medya kullandınız mı?',
				ratingQuestion: 'Medya kullanımınız açısından bugünü nasıl değerlendiriyorsunuz?',
				pastRatingQuestion: 'Medya kullanımınız açısından bu günü nasıl değerlendiriyorsunuz?',
				planHint:
					'Ertesi gün için kendinize bir görev ya da küçük bir hedef koyuyor musunuz? (Örnek: oyun oynamamak, bir işi halletmek, güzel bir şey yapmak vb.)',
				yesIntro:
					'Medya kullanımınızı buraya kaydedin. Lütfen her kullanım durumu / kullanım dönemi için yeni bir kayıt oluşturun.',
				yesMore:
					'Örneğin hem öğlen hem de akşam medya kullandıysanız iki kayıt oluşturun. Belirli bir zaman aralığında birden fazla medya kullandıysanız bunu tek bir kullanım dönemi olarak girebilirsiniz. Günlüğün amacı, medya kullanım davranışınızı danışmanınızla birlikte olabildiğince iyi anlamanız ve böylece onu başarıyla değiştirebilmenizdir.',
				noIntro:
					'Bugün hiç medya kullanmadınız mı? Harika! Size neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				pastNoIntro:
					'Bu gün hiç medya kullanmadınız mı? Harika! Size neyin yardımcı olduğunu ve bu sırada nasıl hissettiğinizi mutlaka yazın.',
				noMore:
					'Belki kontrol stratejilerinizi başarıyla uygulayabildiniz? Günlükteki notlarınız, kalıcı bir davranış değişikliği için özellikle başarılı stratejileri sizin ve danışmanınızın fark etmesine yardımcı olur. Bir şey yazmak istemiyorsanız “kaydet” düğmesine tıklamanız yeterli.',
				contextQuestion: 'Nerede ve kimlerle medya kullandınız?',
				triggerQuestion: 'Neden? Medya kullanımının nedeni / tetikleyicisi neydi?',
				phaseTitle: 'Medya kullanımı ekle',
				newPhase: 'yeni medya dönemi ekle',
				editPhase: 'Medya dönemini düzenle',
				deletePhase: 'Medya dönemini sil',
				deletePhaseQuestion: 'Bu medya dönemi silinsin mi?',
				deleteAllQuestion: 'Bu gün için girilen tüm medya dönemleri silinecek. Yine de devam edilsin mi?',
				saveLabel: 'Kaydı kaydet',
				loggedLabel: 'Kaydedilen medya kullanımı:'
			}
		},
		drinks: {
			beer: 'Bira',
			wine: 'Şarap / köpüklü şarap',
			spirits: 'Sert içki',
			liqueur: 'Likör',
			'beer-mix': 'Biralı karışık içecekler',
			alcopop: 'Alkopop'
		},
		cannabisUnits: {
			joint: 'joint',
			bong: 'bong'
		},
		gameGroups: {
			local: 'Yerinde oynanan kumar oyunları',
			online: 'Çevrimiçi / internet üzerinden'
		},
		games: {
			'slot-arcade': 'Oyun salonlarındaki para ödüllü oyun makineleri',
			'slot-gastro': 'Kafe, bar ve restoranlardaki para ödüllü oyun makineleri',
			'casino-small': 'Kumarhanedeki slot makineleri',
			'casino-large': 'Kumarhanedeki masa oyunları',
			sports: 'Spor bahisleri',
			horses: 'At yarışı bahisleri',
			lottery: 'Piyangolar',
			'other-local': 'Yerinde oynanan diğer kumar oyunları',
			'online-slots': 'Çevrimiçi slot oyunları (para / kumar makineleri)',
			'online-casino': 'Çevrimiçi kumarhane oyunları (poker hariç kumarhane masa oyunları)',
			'online-poker': 'Çevrimiçi poker',
			'online-sports': 'Çevrimiçi spor bahisleri',
			'online-horses': 'Çevrimiçi at yarışı bahisleri',
			'online-lottery': 'Çevrimiçi piyangolar',
			'online-other': 'Diğer çevrimiçi kumar oyunları'
		},
		mediaGroups: {
			games: 'Çevrimiçi oyunlar',
			communication: 'İnternet üzerinden iletişim',
			social: 'Sosyal ağlar (ör. TikTok, Instagram, WhatsApp, Telegram, Facebook)',
			surfing: 'İnternette gezinme',
			more: 'Diğer medya etkinlikleri'
		},
		media: {
			action: 'Aksiyon oyunları (ör. Jump ’n’ Run, Beat ’em up, aksiyon macera)',
			shooter: 'Birinci şahıs nişancı oyunları',
			rpg: 'Rol yapma oyunları (ör. MMORPG, çevrimiçi ve çevrimdışı rol yapma oyunları)',
			strategy: 'Strateji oyunları (ör. gerçek zamanlı strateji, inşa oyunları)',
			'sports-games': 'Spor oyunları (ör. menajerlik oyunları, spor simülasyonları)',
			simulation: 'Simülasyon oyunları (ör. uçuş, araba yarışı veya yaşam simülasyonları)',
			'music-games': 'Müzik ve dans oyunları (ör. Just Dance Now, SingStar, Let’s Sing)',
			skill: 'Beceri oyunları (ör. Tetris)',
			chat: 'Sohbet etmek',
			mail: 'E-posta yazmak',
			'social-watch': 'Video / fotoğraf izlemek',
			'social-talk': 'Başka kişilerle fikir alışverişi',
			research: 'Araştırma',
			shopping: 'Alışveriş',
			magazines: 'Çevrimiçi dergiler',
			streaming: 'Çevrimiçi yayın izleme (ör. Netflix, TV kanallarının uygulamaları, Amazon Prime)',
			porn: 'Porno siteleri',
			device: 'Bilgisayar / cihaz ayarlarıyla uğraşmak',
			'other-media': 'Elektronik medyanın diğer kullanımları'
		},
		items: {
			alcohol: '{count}x {size} {drink}',
			cannabis: '{count}x {unit}',
			otherKind: 'Diğer: {text}',
			otherKindCount: 'Diğer: {count}x {text}',
			duration: '{activity}, {duration}'
		},
		sums: {
			phases: { one: '{count} dönem', other: '{count} dönem' },
			drinks: { one: '{count} içecek', other: '{count} içecek' },
			alcohol: '{drinks}, yaklaşık {grams} g alkol',
			joints: { one: '{count} joint', other: '{count} joint' },
			bongs: { one: '{count} bong', other: '{count} bong' },
			otherKind: '{count}x diğer'
		},
		counsellor: {
			noEntries: 'Henüz kayıt yok.',
			topics: 'Kaydedilen konular: {topics}',
			new: 'Yeni',
			noDayEntries: 'Kayıt yok',
			tileTopic: '{topic}:',
			noConsumption: 'Kullanım kaydedilmedi',
			entriesOf: 'Kayıtlar: {day}',
			answerYes: '{topic}: evet',
			answerNo: '{topic}: hayır',
			device: 'Cihaz',
			context: 'Nerede ve kimlerle',
			trigger: 'Neden / tetikleyici',
			rating: 'Günün değerlendirmesi',
			plan: 'Yarın için plan',
			summaryNew: 'Özet yeni'
		},
		pdf: {
			noEntries: 'Bu dönemde kayıt yok.',
			topics: 'Kaydedilen konular: {topics}',
			answerYes: '{topic}: evet ({sum})',
			answerNo: '{topic}: hayır',
			device: 'Cihaz: {device}',
			context: 'Nerede ve kimlerle: {context}',
			trigger: 'Neden / tetikleyici: {trigger}',
			rating: 'Günün değerlendirmesi',
			plan: 'Yarın için plan'
		},
		demo: {
			alcoholRating: 'Tartışmadan sonra planladığımdan fazla içtim.',
			alcoholPlan: 'İşten sonra doğrudan eve gitmek.',
			alcoholContext: 'Evde, yalnız',
			alcoholTrigger: 'Telefonda tartışma',
			gamblingRating: 'Yanıma para almadım, bu yardımcı oldu.',
			soberRating: 'Akşam bira yerine spor yaptım.',
			soberPlan: 'Yine spora gitmek.',
			gamblingContext: 'Otobüste ve evde',
			gamblingTrigger: 'Can sıkıntısı'
		}
	},
	relativesDiary: {
		title: 'Günlüğüm',
		intro: [
			'Günlük, günün sizi etkileyen, zorlayan ya da güzel olaylarını ve düşüncelerini yazmak içindir. Kayıtlarınızda, günlük görünümde size gösterilen üç soruyu rehber olarak kullanabilirsiniz. Bir kayıt oluşturmak için örneğin bugünün tarihine tıklayın.',
			'Yaşadıklarınızı ve düşüncelerinizi yazmak, onları düzene koymak ve “içinizden atmak” çoğu zaman tek başına bile rahatlatıcıdır. Günlüğe yazdıklarınız kişisel danışmanlığınız için de önemlidir: Danışmanınız durumunuzu ne kadar iyi anlarsa, size o kadar iyi danışmanlık yapılabilir. Bu nedenle kayıtlarınızı danışmanınızın görebileceği şekilde paylaşmanızı öneririz.'
		],
		questionsToday: [
			'Bugün sizin için önemli olan neydi?',
			'Bugün yakınınızla iletişiminiz nasıl geçti?',
			'Bununla ilgili nasıl hissediyorsunuz?'
		],
		questionsOtherDay: [
			'Bu gün sizin için önemli olan neydi?',
			'Bu gün yakınınızla iletişiminiz nasıl geçti?',
			'Bununla ilgili nasıl hissediyorsunuz?'
		],
		moodQuestionToday: 'Bugünü nasıl değerlendiriyorsunuz?',
		moodQuestionOtherDay: 'Bu günü nasıl değerlendiriyorsunuz?',
		moods: {
			'very-bad': 'çok kötü',
			'rather-bad': 'biraz kötü',
			average: 'orta',
			'rather-good': 'biraz iyi',
			'very-good': 'çok iyi'
		},
		noMood: 'bilgi yok',
		weekEntriesHeading: 'Günlük kayıtları',
		weekMoodHeading: 'Ruh hâli',
		openEntry: 'Aç',
		openEntryLabel: 'Kaydı aç: {day}',
		createEntry: 'Kayıt oluştur',
		createEntryLabel: 'Kayıt oluştur: {day}',
		backToOverview: 'genel bakışa dön',
		entryLabel: 'Günlük kaydı',
		emptyEntry: 'Lütfen bir şeyler yazın ya da günü değerlendirin.',
		saveEntry: 'Kaydı kaydet',
		deleteEntry: 'Kaydı sil',
		deleteConfirm: 'Bu günlük kaydı silinsin mi?',
		deleteButton: 'Sil',
		weekView: 'Haftalık görünüm',
		allEntries: 'Tüm kayıtlar',
		new: 'Yeni',
		noEntryForDay: 'Kayıt yok',
		noEntries: 'Henüz kayıt yok.',
		pdfNoEntries: 'Bu dönemde kayıt yok.',
		pdfMood: 'Günün değerlendirmesi: {mood}',
		pdfNoText: 'Metin girilmedi.',
		demoEntries: [
			'Bu akşam eve geç geldiğinde yine tartıştık. Sakin kalmaya ve onu suçlamamaya çalıştım. Sonrasında yorgun düştüm ama biraz da gurur duydum.',
			'Sakin bir gün. Birlikte yürüyüşe çıktık ve tatil hakkında konuştuk.'
		]
	},
	balance: {
		intro:
			'Kendi alışkanlıklarını değiştirmek her zaman zorlu bir iştir. Her değişiklik yorucudur, güç ister ve sabır gerektirir. Motivasyon terazisi, bağımlılık davranışını bırakmanın artılarını ve eksilerini netleştirmenize yardımcı olur.',
		howItWorks: 'Motivasyon terazisi nasıl çalışır',
		howItWorksStep: '{title}:',
		howItWorksSteps: [
			{
				title: 'Gerekçeleri toplayın',
				text: 'Kendiniz için düşünün: Davranışımı değiştirirsem, örneğin içmeyi, kumar oynamayı veya esrar içmeyi bırakırsam ne olur? Eskisi gibi devam edersem ne olur? Bunu yaparken kendinize karşı dürüst olun!'
			},
			{
				title: 'Değerlendirin',
				text: 'Her iki durumda da bir değişikliğin etkileri sizin için olumlu ya da olumsuz olabilir. Bu etkilerin sizin için çok mu önemli yoksa daha az mı önemli olduğunu da düşünün.'
			},
			{
				title: 'Sonuca bakın',
				text: 'Tüm artıları ve eksileri girip değerlendirdiğinizde, motivasyon terazisi seçtiğiniz konu hakkındaki mevcut iç tutumunuzu gösterir.'
			},
			{
				title: 'Bir sonuç çıkarın',
				text: 'Vardığınız sonuç nedir? Mevcut motivasyonunuzu nasıl değerlendiriyorsunuz? Davranışınızı değiştirmeye içten hazır mısınız? Yoksa daha fazla gerekçeye mi ihtiyacınız var?'
			}
		],
		howItWorksNote:
			'Aklınıza yeni artılar ve eksiler geldiğinde alıştırmayı istediğiniz zaman yeniden düzenleyebilir ve tamamlayabilirsiniz. İsterseniz danışmanınız bilgilerinizi görebilir ve böylece bu niyetinizde size en iyi şekilde destek olabilir.',
		workOnExerciseFirst: 'Lütfen önce alıştırmayı yapın.',
		sides: { pro: 'ARTI', contra: 'EKSİ' },
		poles: [
			{ contra: 'Değişime KARŞI', pro: 'Değişimden YANA' },
			{ contra: 'değişiklik yok', pro: 'Bir şeyleri değiştirmek istiyorum!' },
			{ contra: 'olduğu gibi iyi', pro: 'bir şeylerin değişmesi gerek!' }
		],
		ratings: {
			very: 'çok önemli',
			quite: 'oldukça önemli',
			some: 'biraz önemli',
			none: 'hiç önemli değil'
		},
		notImportant: 'önemli değil',
		ratingOption: '{label} ({stars})',
		ratingQuestion: 'Bu konu sizin için ne kadar önemli?',
		halves: {
			change: 'Hedefime ulaşırsam / davranışımı değiştirirsem, bunun şu …',
			keep: 'Davranışımı değiştirmezsem / hedefime ulaşamazsam, bunun şu …'
		},
		categoryInHalf: '… {title}',
		categoryWithSide: '{category} ({side})',
		categories: {
			A: {
				title: 'avantajları olur',
				long: 'Davranış değişikliğinin avantajları',
				listTitle: 'Hedefinize ulaşırsanız girdiğiniz avantajlar:'
			},
			B: {
				title: 'dezavantajları olur',
				long: 'Davranış değişikliğinin dezavantajları',
				listTitle: 'Hedefinize ulaşırsanız girdiğiniz dezavantajlar:'
			},
			C: {
				title: 'avantajları olur',
				long: 'Hiçbir şey değişmezse avantajlar',
				listTitle: 'Davranışınızı değiştirmezseniz girdiğiniz avantajlar:'
			},
			D: {
				title: 'dezavantajları olur',
				long: 'Hiçbir şey değişmezse dezavantajlar',
				listTitle: 'Davranışınızı değiştirmezseniz girdiğiniz dezavantajlar:'
			}
		},
		argumentKinds: {
			advantage: {
				missing: 'Lütfen bir avantaj girin.',
				add: 'Yeni avantaj',
				edit: 'Avantajı düzenle',
				placeholder: 'Avantajı buraya yazın. Her avantaj için yeni bir kayıt kullanın.'
			},
			disadvantage: {
				missing: 'Lütfen bir dezavantaj girin.',
				add: 'Yeni dezavantaj',
				edit: 'Dezavantajı düzenle',
				placeholder: 'Dezavantajı buraya yazın. Her dezavantaj için yeni bir kayıt kullanın.'
			}
		},
		examples: {
			A: [
				'İşlerimi yeniden daha iyi yoluna koyarım.',
				'Hobilerime yeniden zamanım olur.',
				'Yeniden net düşünebilirim.',
				'Daha fazla para / daha az borç.',
				'Vücudum artık o kadar zorlanmaz.',
				'Kendimi daha iyi hissederim.',
				'Sorunu ele aldığım için iyi bir his.',
				'Arkadaşlarımla / ailemle daha az sorun.'
			],
			B: [
				'Eski arkadaş çevremle zorlaşacak.',
				'Sarhoşluk / kafa hâli hissini özleyeceğim.',
				'Epey sıkıcı olabilir.',
				'Pek çok şey çok daha az eğlenceli olacak.',
				'Yoksunluk / bırakmak zor olacak.',
				'Büyük kazanç umudu ortadan kalkar.'
			],
			C: [
				'Daha kolay uykuya dalarım.',
				'Arkadaşlarla daha eğlenceli vakit.',
				'İçerken / oynarken / esrar içerken kafamı dinlerim.',
				'Bazen gerçekten “kendimi kaybedip” etrafımdaki her şeyi unutabilirim.',
				'Kazanma şansı devam eder.'
			],
			D: [
				'Neredeyse başka hiçbir şey yapmıyorum.',
				'Başka pek çok şeyi ihmal ediyorum.',
				'Kendime giderek daha çok kızıyorum.',
				'Ailemle sorunlar ve tartışmalar devam ediyor.',
				'Sabahları yataktan zor kalkıyorum.',
				'Borçlar kalıyor / artmaya devam ediyor.',
				'Sağlığım kötüye gitmeye devam ediyor.',
				'Hayatım tek bir soruna indirgenmiş olarak kalıyor.'
			]
		},
		tendency: {
			pending: 'Henüz hesaplanamıyor',
			balanced: 'Dengeli',
			maximum: 'En güçlü {side} yönünde eğilim',
			clear: '{side} yönünde eğilim',
			slight: 'Hafif {side} yönünde eğilim'
		},
		resultLabel: 'Motivasyon terazisinin sonucu',
		scaleTitle: 'Motivasyon terazisi: {value}, {tendency}',
		scaleInactiveTitle: 'Motivasyon terazisi: henüz etkin değil',
		allRatedZero: 'Tüm gerekçeler “hiç önemli değil” olarak değerlendirildiği için terazi henüz etkin değil.',
		sidePoints: { one: '{side} {count} puan', other: '{side} {count} puan' },
		valueWithTendency: '{value}, {tendency}',
		miniInactive: 'Terazi henüz etkin değil',
		conclusionTitle: 'Vardığım sonuç',
		conclusionPrompt:
			'Tüm gerekçeleri topladıktan sonra nasıl bir tablo ortaya çıkıyor? Şu an için kendiniz adına hangi sonuçları çıkarıyorsunuz?',
		saveConclusion: 'Sonucu kaydet',
		edit: 'Düzenle',
		add: 'Ekle',
		noEntriesYet: 'Henüz kayıt yok.',
		backToOverview: 'Motivasyon terazisine genel bakışa dön',
		argumentType: 'Gerekçe türü',
		showExamples: 'Örnekleri göster',
		hideExamples: 'Örnekleri gizle',
		allExamplesUsed: 'Tüm örnekler zaten eklendi.',
		ratingMissing: 'Lütfen bu konunun sizin için ne kadar önemli olduğunu değerlendirin.',
		saveChange: 'Değişikliği kaydet',
		addEntry: 'Kayıt ekle',
		confirmDelete: 'Bu kayıt silinsin mi?',
		delete: 'Sil',
		editItem: 'Düzenle: {text}',
		deleteItem: 'Sil: {text}',
		finish: 'Bitir',
		counsellor: {
			noArguments: 'Henüz gerekçe girilmedi.',
			conclusion: 'Sonuç',
			new: 'Yeni',
			noConclusion: 'Henüz sonuç girilmedi.',
			noEntries: 'Kayıt yok.',
			open: 'Aç',
			close: 'Kapat',
			category: 'Kategori',
			relevance: 'Önem',
			relevanceValue: { one: '{label} ({count} puan)', other: '{label} ({count} puan)' },
			lastChanged: 'Son değişiklik'
		},
		pdf: {
			result: 'Sonuç',
			inactive: 'Terazi henüz etkin değil (önem puanı yok).',
			summary: 'Motivasyon değeri {value} ({tendency}), {pro}, {contra}, −10 ile +10 arasındaki ölçekte.',
			conclusion: 'Sonuç',
			noConclusion: 'Sonuç girilmedi.',
			arguments: 'Gerekçeler',
			noEntries: 'Kayıt yok.',
			rating: '{label} ({count})'
		}
	},
	emergencyKit: {
		sections: {
			motivation: {
				title: 'Motivasyonum: Bu yüzden devam ediyorum',
				listLabel: 'Davranışımı değiştirmek / hedefime ulaşmak istememin nedenleri:',
				fieldLabel: 'Davranışımı değiştirmek / hedefime ulaşmak istememin nedenleri',
				cardTitle: 'Bu yüzden devam ediyorum',
				intro:
					'Kişisel hedefinizin peşinden gitmeniz için pek çok iyi neden var. Sizin için kişisel olarak en önemli nedenleri buraya yazın. Bu, kararınızı daha da sağlamlaştırmanıza yardımcı olur. Nedenlerinizi her zaman aklınızda tutmak için onları tekrar tekrar okuyun. Size yol gösterebilecek bazı örnekleri sizin için bir araya getirdik.',
				examples: [
					{
						label: 'Örnekler',
						items: [
							'Başka şeylere yeniden zamanım olur',
							'Sonunda suçluluk duygusu yok',
							'Eşim / partnerim bana yeniden güvenebilsin',
							'Kendimi yeniden hissetmek istiyorum',
							'Sürekli bunu düşünmek zorunda kalmak istemiyorum',
							'Böyle devam edersem ilişkim biter',
							'Sonunda yeniden özgür olmak',
							'Aileme, arkadaşlarıma, işverenime artık yalan söylemek zorunda değilim',
							'Artık gizli saklı işler yok, çifte hayat yok',
							'Çocuklarımın yüzüne yeniden bakabilirim',
							'Sonunda başka şeyler için yeniden zaman ve güç',
							'Para bulmak için artık suç teşkil eden işler yok',
							'Yeniden aynada kendi yüzüme bakabilirim',
							'Sonunda yeni borç yok',
							'Böyle devam edersem sorunların içine giderek daha çok batarım'
						]
					}
				]
			},
			strategy: {
				title: 'Günlük hayat için stratejilerim',
				listLabel: 'Hedefime ulaşmamda bana yardımcı olanlar:',
				fieldLabel: 'Günlük hayatta bana yardımcı olanlar',
				cardTitle: 'Günlük hayatta bana yardımcı olanlar',
				intro:
					'Günlük hayatta hedefinize ulaşmanıza yardımcı olan her şeyi buraya yazın. Özellikle kendiniz için koyduğunuz basit davranış kuralları faydalıdır. Ancak düzenli olarak yaptığınız hobiler ve etkinlikler de yoğun madde isteğinden uzaklaşmanıza, stresi azaltmanıza ve hedefinize uzun vadede ulaşmanıza yardımcı olur. Aşağıda kullanabileceğiniz bazı örnekler bulunuyor.',
				examples: [
					{
						label: 'Genel',
						items: [
							'Yardım almaya devam ediyorum',
							'Kendine yardım grubuma düzenli olarak gidiyorum',
							'Arkadaşlıklarıma özen gösteriyorum',
							'Boş zamanımı aktif geçirmeye özen gösteriyorum',
							'Öfkemi ve hayal kırıklığımı içime atmıyorum',
							'Riske girmiyorum',
							'Birlikte kumar oynadığım / içtiğim arkadaşlarımdan uzak duruyorum',
							'Madde kullanan arkadaş çevremden uzak duruyorum',
							'Düzenli olarak spor yapıyorum',
							'Risk durumlarına ve olası bir nüksün erken uyarı işaretlerine dikkat ediyorum',
							'Tamamen bırakma hedefim üzerinde sürekli çalışıyorum',
							'İhtiyaçlarımı savunuyorum',
							'Ara sıra kendimi ödüllendiriyorum',
							'Kendime güzel bir şey ısmarlıyorum',
							'Sorunlarımla yüzleşiyorum',
							'Borçlarımla ilgileniyorum'
						]
					},
					{
						label: 'Kumar',
						items: [
							'Çevrimiçi kumar sitelerine erişimi engelleyen bir program kuruyorum',
							'Kumar oynanan yerlerden uzak duruyorum',
							'Bir oyun salonu gördüğümde yolun karşı tarafına geçiyorum',
							'Günlük / haftalık ne kadar para harcayacağıma dair kendime net sınırlar koyuyorum',
							'Paramı bilinçli olarak gerçekten ihtiyacım olan şeylere harcıyorum',
							'Yanıma ne kadar nakit para aldığıma dikkat ediyorum'
						]
					}
				]
			},
			support: {
				title: 'Destek alabileceğim yerler'
			},
			critical: {
				title: 'Kritik durumlar, ruh hâlleri ve düşünceler',
				listLabel: '“İç risk durumları”: Burada özellikle dikkatli olmalıyım!',
				fieldLabel: 'Dikkatli olmam gereken durumlar ve ruh hâlleri',
				cardTitle: 'Burada dikkatli olmalıyım',
				intro:
					'Bu alıştırmada, eski davranış kalıplarına geri dönme tehlikesiyle karşılaştığınız durumları, ruh hâllerini ve düşünceleri tanımayı öğrenirsiniz. Bunlara “iç risk durumları” da denir. Hangi düşünceler ve ruh hâlleri kararınızı ve hedefinizi tehlikeye atabilir? Yani hangi durumlarda özellikle dikkatli olmalısınız? Örneklerimize göz atın. Pek çok ruh hâli veya düşünce, ilk bakışta asıl sorunlu davranışla pek ilgili görünmez. Sizin kendinize özgü “iç risk durumlarınız” neler?',
				examples: [
					{
						label: 'Genel',
						items: [
							'“Eski güzel günleri” düşündüğümde',
							'Her şeyin o kadar da kötü olmadığını düşündüğümde',
							'“Bir kereden bir şey olmaz” diye düşündüğümde',
							'Yeniden eski tanıdıklarla bir araya geldiğimde',
							'Moralim bozuk olduğunda ve “sakinleşmek” için bir şeye ihtiyaç duyduğumda',
							'İşte veya ilişkimde hayal kırıklığı yaşadığımda',
							'Her şey istediğim gibi gitmediğinde',
							'Canım sıkıldığında',
							'Stresli olduğumda ve rahatlamak istediğimde',
							'“Artık her şey zaten fark etmez” diye düşündüğümde',
							'Başardığımı düşündüğüm için dikkatsizleştiğimde',
							'Aslında hiç bağımlı olmadığımı düşündüğümde',
							'Eşimle / partnerimle yeniden çok tartıştığımda'
						]
					},
					{
						label: 'Kumar',
						items: [
							'“Sadece merak ettiğim için” yeniden oynamak istediğimde',
							'Başardıklarım için kendimi makineye “sadece birkaç bozuk para” atarak ödüllendirmek istediğimde',
							'Maddi sorunlarımı bu şekilde çözebileceğimi düşündüğümde',
							'Yanımda çok fazla para taşıdığımda',
							'Alkol içtiğimde',
							'Yeniden daha sık kumar oynamayı düşündüğümde',
							'“Bir kere kumarhaneye gitmekten zarar gelmez” diye düşündüğümde'
						]
					},
					{
						label: 'Alkol',
						items: [
							'“Sadece merak ettiğim için” yeniden içmek istediğimde',
							'Başardıklarım için kendimi “sadece küçük bir bira” içerek ödüllendirmek istediğimde'
						]
					},
					{
						label: 'Esrar',
						items: [
							'“Sadece merak ettiğim için” yeniden esrar içmek istediğimde',
							'Başardıklarım için kendimi “jointten sadece bir nefes” alarak ödüllendirmek istediğimde'
						]
					}
				]
			},
			craving: {
				title: 'Craving (yoğun madde isteği) anında bana yardımcı olanlar',
				listLabel: 'Craving / yoğun madde isteği yaşadığımda bana yardımcı olanlar:',
				fieldLabel: 'Craving / yoğun madde isteği yaşadığımda bana yardımcı olanlar',
				cardTitle: 'Yoğun madde isteğinde',
				intro:
					'Bağımlılık davranışını bırakan kişiler, uzun bir süre boyunca tekrar tekrar eski davranışa geri dönmek için güçlü bir istek duyar. Bu duruma “craving” (İngilizcede özlem, açlık anlamına gelir) ya da yoğun madde isteği denir. Yoğun istek genellikle kısa sürer. Bu gibi durumlarda kısa “acil durum talimatları”, yoğun isteği atlatmanıza yardımcı olabilir. Talimatlar çok doğrudan ve somut olmalıdır (kendinize verdiğiniz bir emir gibi). Sakin kalmanıza ve yoğun isteğe direnmenize yardımcı olurlar. Cümleleri kısa ve çok açık yazmaya dikkat edin.',
				examples: [
					{
						label: 'Örnekler',
						items: [
							'Hemen başka etkinliklerle dikkatimi dağıtıyorum (spor yapıyorum, alışverişe gidiyorum, sinemaya gidiyorum)',
							'Güvendiğim kişiyi hemen arıyorum',
							'Günlüğüme bir kayıt yazıyorum',
							'Şimdiye kadar ne kadar çok şey başardığımı düşünüyorum',
							'Danışmanıma bir mesaj yazıyorum',
							'Şimdiye kadarki başarılarımla gurur duyuyorum',
							'Bir bağımlılık danışmanlık merkezini arıyorum',
							'Güvenli bir yere gidiyorum, güvendiğim bir kişiyle buluşuyorum',
							'Şimdiye kadar başardıklarımı riske atmıyorum!',
							'Ne kadar yol kat ettiğimi düşünüyorum!',
							'Şunu düşünüyorum: “Aileni yüzüstü bırakma!”',
							'İlişkimi tehlikeye atmıyorum!',
							'Kendime şunu söylüyorum: “DUR! Hemen buradan uzaklaş! Şimdi!”'
						]
					}
				]
			},
			risks: {
				title: 'En önemli risk durumlarım ve kontrol stratejilerim',
				cardTitle: 'Risk durumları ve stratejiler'
			},
			relapse: {
				title: 'Nüks: Ne yapmalı?',
				listLabel: 'Nüks durumunda yapacaklarım:',
				fieldLabel: 'Nüks durumunda yapacaklarım',
				cardTitle: 'Nüks durumunda',
				intro:
					'Bir nüks yaşanırsa: Panik yapmayın! Niyetinizden vazgeçmeyin. Nükslerden ders çıkarabilir ve başa çıkma stratejilerinizi daha sonra buna göre geliştirebilirsiniz. Ancak ilk ve en önemli komut şudur: DUR! Daha fazla zararı önlemek veya sınırlamak için o durumdan olabildiğince hızlı uzaklaşmalısınız. Nüks durumunda nasıl davranmak istersiniz? Tam olarak ne yapabilirsiniz? Böyle bir durum için size kişisel olarak yardımcı olacak somut talimatları buraya yazın.',
				examples: [
					{
						label: 'Örnekler',
						items: [
							'Kumar oynamayı / içmeyi / esrar içmeyi HEMEN bırakıyorum ve kontrolü kaybettiğimi kabul ediyorum!',
							'Olabildiğince hızlı dışarı çıkıyor ve oradan uzaklaşıyorum!',
							'Nüksü saklamıyorum, aileme açılıyorum',
							'Utansam bile güvendiğim kişiyi hemen arıyorum',
							'Şuradan destek alıyorum: …',
							'Nüksümü ciddiye alıyorum ama onu bir felaket olarak görmüyorum',
							'Bu durumu hedefim üzerinde çalışmaya devam etmek için bir fırsat olarak görüyorum',
							'Nüksü başa çıkma stratejilerimi geliştirmek için kullanıyorum',
							'Pes etmiyorum!'
						]
					}
				]
			}
		},
		importance: { veryImportant: 'çok önemli', important: 'önemli' },
		start:
			'Yerleşmiş davranışlardan, alışkanlıklardan ve düşünce kalıplarından vazgeçmek zordur. Bu özellikle bağımlılık hastalıkları için geçerlidir. Yoğun madde isteğine (“craving”) direnmek çoğu zaman büyük çaba gerektirir. Kişisel “acil durum çantanızda”, nükslerden kaçınmanıza ve zorluklara hazırlıklı olmanıza yardımcı olacak önemli bilgileri toplarsınız.',
		more: 'Eski alışkanlıklara geri dönme riski ilk günlerde, haftalarda ve aylarda özellikle yüksektir. Bu alıştırmanın amacı, zor durumlarda işe yarayan stratejileri hazırda bulundurmak ve yoğun madde isteğine uygun şekilde tepki verebilmektir. Kişisel stratejilerinizi hazırlamak ve “acil durum çantanızı” oluşturmak için bu alıştırmadaki soruları ve önerileri kullanın. İsterseniz danışmanınız bu konuda size destek olacaktır.',
		showInfo: 'Bilgi metnini göster',
		hideInfo: 'Bilgi metnini gizle',
		printTitle: 'Acil durum çantasını yazdır',
		confirmLabel: 'Yine de devam edilsin mi?',
		confirmEmpty: 'En az bir bölümde kayıt yok. Yine de devam edilsin mi?',
		proceed: 'Devam et',
		printKit: 'Acil durum çantasının tamamını PDF olarak al',
		printCard: 'Kartvizit boyutunda acil durum çantası',
		cardHint:
			'Kartvizit boyutu kesildiğinde her cüzdana sığar; böylece acil durum çantanız her zaman yanınızda olur.',
		missingImportance: 'Lütfen her kayıt için sizin açınızdan ne kadar önemli olduğunu seçin.',
		backToKit: 'Acil durum çantasına dön',
		back: 'Geri',
		part: 'Acil durum çantası, bölüm {number}',
		entryLabel: 'Kayıt {number}',
		importanceQuestion: 'Ne kadar önemli?',
		choose: 'Lütfen seçin',
		deleteLabel: 'Sil: {text}',
		addEntry: '+ Yeni kayıt',
		save: 'Kaydet',
		showExamples: 'Örnekleri göster',
		hideExamples: 'Örnekleri gizle',
		examplesByTopic: 'Konuya göre örnekler',
		allExamplesUsed: 'Tüm örnekler zaten eklendi.',
		pickExample: 'Bir örneğe tıkladığınızda o örnek kayıt olarak eklenir.',
		myTrusted: 'Güvendiğim kişi(ler)',
		change: 'Değiştir',
		addTrusted: 'Güvendiğiniz kişiyi ekleyin',
		myAgency: 'Danışmanlık merkezim',
		showAgency: 'Göster',
		counsellorsLine: 'Danışmanlık: {names}',
		notStored: 'Henüz eklenmedi',
		mySelfHelp: 'Kendine yardım grubum',
		addSelfHelp: 'Kendine yardım grubunu ekleyin',
		requestedOn: 'Öneri talep tarihi: {date}',
		trustedIntro: [
			'Yakın çevrenizdeki insanları sürece dahil etmek, yükünüzü büyük ölçüde hafifletebilir. Sorunu daha önce birileriyle paylaştınız mı? O hâlde bu kişilerin adlarını ve/veya rollerini (ör. arkadaş, kardeş, anne, dede) destek listenize ekleyin.',
			'Şimdiye kadar kimseye anlatmadıysanız, ileride kimi güvendiğiniz bir kişi olarak sürece dahil edebileceğinizi düşünün. Arkadaş çevrenizi, ailenizi, komşularınızı veya özel hayatınızdaki size yakın diğer kişileri düşünün. Bu niyetinizde size kim destek olabilir ve zor durumlarda yardım edebilir?'
		],
		trustedField: 'Güvendiğim kişi {number}: ad / rol',
		trustedPlaceholder: 'Ad girin',
		rowLabel: 'Satır {number}',
		addRow: '+ Satır ekle',
		saveEntries: 'Kayıtları kaydet',
		agencyIntro:
			'Danışmanınız yalnızca dijital olarak değil, yüz yüze de sizin için orada. Danışmanınızı telefonla arayın, yüz yüze danışmanlık için randevu alın ya da açık danışma saatlerine gidin.',
		yourAgency: 'Danışmanlık merkeziniz:',
		agencyMissing:
			'Danışmanlık merkezinizin iletişim bilgileri burada henüz kayıtlı değil. Danışmanınız bu bilgileri size memnuniyetle iletecektir.',
		yourCounsellor: 'Danışmanınız:',
		selfHelpIntro: [
			'Kendine yardım grupları, sorunu yaşayan kişilerin ve yakınlarının birbirleriyle fikir alışverişi yapmasını sağlar. Bu yalnızca ruhsal olarak rahatlatmakla kalmaz. Grup üyeleri, diğer katılımcıların deneyimlerinden de yararlanır. Kendine yardım grupları, danışmanlık merkezleri veya kendine yardım kuruluşları aracılığıyla düzenlenir.',
			'Danışmanınız size yakın bir yerde ya da çevrimiçi uygun grupları bulmanıza yardımcı olur.'
		],
		requestButton: 'Bana bir kendine yardım grubu önerilmesini istiyorum.',
		requestDone: 'Bana bir kendine yardım grubu önerilmesini istiyorum. (talep tarihi: {date})',
		requestHint: 'Bunun üzerine danışmanınıza bir mesaj gönderilir.',
		nakosText:
			'Aşağıdaki bağlantı yardımıyla çevrenizdeki kendine yardım grupları hakkında kendiniz de bilgi arayabilirsiniz:',
		nakosLink: 'NAKOS (Kendine Yardım Gruplarını Teşvik ve Destek Ulusal İletişim ve Bilgi Merkezi, Almanca)',
		selfHelpField: 'Kendine yardım grubum:',
		selfHelpPlaceholder:
			'Grubun adını, toplantı tarih(ler)ini, iletişim kişisini ve telefon numarasını buraya yazın',
		risksIntro:
			'Burada “Risk durumları ve kontrol stratejileri” alıştırmasında hazırladığınız tüm risk durumlarını ve ilgili kontrol stratejilerini bulabilirsiniz. Danışmanlık sürecinde risk durumlarıyla başarıyla başa çıkmak için başka yöntemler ve stratejiler öğrendiyseniz, bunları aşağıdaki metin alanına yazabilirsiniz.',
		noRisks: '“Risk durumları ve kontrol stratejileri” alıştırmasında henüz bir risk durumu girmediniz.',
		riskSituation: 'Risk durumu',
		rating: 'Değerlendirme',
		controlStrategy: 'Kontrol stratejisi',
		noStrategy: 'Henüz kontrol stratejisi yok',
		printRisk: 'Çıktıya eklensin mi?',
		otherStrategies: 'Öğrendiğim ve gelecekte bilinçli olarak kullanmak istediğim diğer stratejiler:',
		previewEmpty: 'Henüz kayıt yok',
		previewMore: 've {count} tane daha',
		selfHelpLine: 'Kendine yardım grubu: {text}',
		new: 'Yeni',
		noEntries: 'Kayıt yok.',
		trusted: 'Güvenilen kişi(ler)',
		selfHelp: 'Kendine yardım grubu',
		requestWanted: 'Öneri isteniyor',
		requestSince: 'talep tarihi: {date}',
		noPrintedRisks: 'Çıktı için hiçbir risk durumu seçilmedi.',
		risksOnlyShared:
			'Risk durumları yalnızca “Risk durumları ve kontrol stratejileri” de paylaşıldığı sürece görünür.',
		pdf: {
			title: 'Acil durum çantam',
			noAnswer: 'Bilgi yok',
			agencyMissing: 'Danışmanlık merkezinizin iletişim bilgileri burada henüz kayıtlı değil.',
			myCounsellor: 'Danışmanım',
			requested: 'Kendine yardım grubu önerisi talep tarihi: {date}.',
			cardsTitle: 'Kartvizit boyutunda acil durum çantam',
			cardsHint: 'Kesikli çizgilerden kesip yanınızda taşıyabilirsiniz.',
			cardsEmpty: 'Henüz kayıt yok.',
			cardRiskRated: '{situation} (değerlendirme: {rating})',
			cardRiskStrategy: '{situation}: {strategy}'
		},
		request: {
			title: 'Kendine yardım grubu talep edildi',
			text: '{name} kendisine bir kendine yardım grubu önerilmesini istiyor. Lütfen bu kişiye, “Acil durum çantası” alıştırmasındaki “Kendine yardım grubum” bölümüne yazabileceği uygun bilgileri (grubun adı, toplantı tarih(ler)i, iletişim kişisi, telefon numarası) iletin ve gerekirse diğer konuları konuşmak için mesaj işlevi üzerinden iletişime geçin. Bu, danışmanlık araçları tarafından otomatik olarak oluşturulmuş bir mesajdır.',
			textUnnamed:
				'Bir danışan kendisine bir kendine yardım grubu önerilmesini istiyor. Lütfen bu kişiye, “Acil durum çantası” alıştırmasındaki “Kendine yardım grubum” bölümüne yazabileceği uygun bilgileri (grubun adı, toplantı tarih(ler)i, iletişim kişisi, telefon numarası) iletin ve gerekirse diğer konuları konuşmak için mesaj işlevi üzerinden iletişime geçin. Bu, danışmanlık araçları tarafından otomatik olarak oluşturulmuş bir mesajdır.'
		},
		demo: {
			motivations: ['Sonunda yeniden özgür olmak', 'Çocuklarımın yüzüne yeniden bakabilirim'],
			strategy: 'Düzenli olarak spor yapıyorum',
			trusted: 'Ayşe (kız kardeşim)',
			craving: 'Güvendiğim kişiyi hemen arıyorum',
			relapse: 'Pes etmiyorum!'
		}
	},
	active: {
		intro: [
			'Kendine özen göstermek, iyi bir yaşam kalitesine büyük ölçüde katkıda bulunur. İyi bir yaşam kalitesi stresi azaltmaya, yoğun madde isteğini (craving) hafifletmeye ve nükslerden kaçınmaya yardımcı olur.',
			'Özellikle sportif, yaratıcı ve sosyal etkinlikler ruh hâlinizi belirgin şekilde iyileştirmeye veya yoksunluk belirtilerini azaltmaya yardımcı olur. Önceden planlanmış başka olumlu etkinlikler de eski alışkanlıkları veya davranış kalıplarını aşmanıza yardımcı olur. Özellikle de bunları günlük hayatınıza düzenli olarak eklerseniz. Önemli olan, bunları yaparken kendinizi iyi hissetmenizdir. Bu alıştırma, günlük hayatınızı aktif ve keyifli hâle getirmenize destek olur. Önerilerimizi kullanın ya da etkinlikler için kendi fikirlerinizi yazın.'
		],
		howToToggle: 'Nasıl ilerlerim?',
		howTo: [
			'Planladığınız etkinlikleri aşağıya yazın. “Etkinlik ekle” düğmesine tıkladığınızda kayıt eklenir.',
			'Planlarınızın uygulanabilir olmasına dikkat edin. Hangi etkinlikleri ne zaman gerçekçi olarak yapabileceğinizi olabildiğince ayrıntılı düşünün.',
			'Gerekirse size uygun bir etkinlik bulmak için önerilerimizi kullanın.',
			'Planlanan etkinlikler günlüğünüzde otomatik olarak gösterilir. İsterseniz kayıtlarınızı kişisel takviminize de ekleyebilirsiniz.'
		],
		newTitle: 'Yeni etkinlik planla',
		editTitle: 'Etkinliği düzenle',
		suggestionsButton: 'Etkinlik önerileri',
		titleLabel: 'Etkinlik girin',
		titlePlaceholder: 'Etkinliğin adı veya açıklaması',
		dateLabel: 'Tarih seçin (isteğe bağlı)',
		timeLabel: 'Saat seçin (isteğe bağlı)',
		repeatLabel: 'Etkinlik tekrarlansın mı?',
		repeatOptions: {
			none: 'hayır',
			daily: 'her gün',
			weekly: 'her hafta',
			custom: 'seçilen tarihlerde'
		},
		furtherDateLabel: 'Başka bir tarih',
		addDate: 'Tarih ekle',
		furtherDatesLabel: 'Diğer tarihler',
		removeDate: 'kaldır',
		removeDateLabel: 'Tarihi kaldır: {day}',
		companionLabel: 'Eşlik eden kişi (isteğe bağlı)',
		companionPlaceholder: 'Size eşlik eden kişinin adı',
		missingTitle: 'Lütfen bir etkinlik girin.',
		missingDate: 'Saat ve tekrar için lütfen bir tarih de seçin.',
		add: 'Etkinlik ekle',
		saveChange: 'Değişikliği kaydet',
		listTitle: 'Girilen etkinlikler',
		addToCalendar: 'Takvimime ekle',
		calendarFileName: 'aktif-olmak.ics',
		empty: 'Henüz etkinlik girilmedi.',
		editLabel: 'Düzenle: {title}',
		deleteTitle: 'Etkinliği sil',
		deleteLabel: 'Sil: {title}',
		confirmDelete: 'Bu etkinlik silinsin mi?',
		delete: 'Sil',
		noDate: 'tarih yok',
		noFurtherDate: 'başka tarih yok',
		dayAndTime: '{day}, {time}',
		nextLine: 'Sonraki tarih: {next}',
		nextLineWithRepeat: 'Sonraki tarih: {next} ({repeat})',
		repeatLine: 'Tekrar: {repeat}',
		furtherDatesLine: 'Diğer tarihler: {dates}',
		companionLine: 'Eşlik eden: {companion}',
		noCompanion: 'bilgi yok',
		counsellor: {
			next: 'Sonraki tarih',
			repeat: 'Tekrar',
			repeatWithDates: '{repeat}: {dates}',
			companion: 'Eşlik eden',
			lastChanged: 'Son değişiklik',
			new: 'Yeni'
		},
		backToPlanning: 'Planlamaya dön',
		suggestionsTitle: 'Etkinlik önerileri',
		suggestionsHint:
			'Önerilerimizi kendi planlamanız için ilham kaynağı olarak kullanın. Niyetinizi mümkünse daha da somut olarak yazın.',
		suggestions: {
			sport: {
				title: 'Aktif ve sportif',
				items: [
					'Yürüyüşe çıkmak',
					'Koşuya çıkmak',
					'Futbol oynamak',
					'Badminton oynamak',
					'Masa tenisi oynamak',
					'Spor salonuna gitmek',
					'Dans etmek',
					'Bisiklete binmek veya bisiklet turuna çıkmak',
					'Bir geziye çıkmak',
					'Doğa yürüyüşü yapmak',
					'Tırmanma salonuna gitmek',
					'Boks yapmak',
					'Yüzmek',
					'Mini golf oynamak',
					'Bowling oynamak'
				]
			},
			relaxation: {
				title: 'Rahatlama',
				items: [
					'Saunaya gitmek',
					'Banyo yapmak veya duş almak',
					'Masaj yaptırmak',
					'Müzik dinlemek',
					'Mum yakmak',
					'Bir gevşeme tekniği öğrenmek',
					'Meditasyon veya yoga yapmak',
					'Öpüşmek',
					'Flört etmek',
					'Sarılmak',
					'Bir radyo tiyatrosu / sesli hikâye dinlemek'
				]
			},
			inspiration: {
				title: 'İlham',
				items: [
					'Bir kitap okumak',
					'Bir gazete veya dergi okumak',
					'Karikatür veya çizgi roman okumak',
					'Telefonla konuşmak',
					'E-posta veya mektup yazmak',
					'Sinemaya gitmek',
					'Film gecesi yapmak',
					'Tiyatroya gitmek',
					'Bir konferansa / söyleşiye gitmek',
					'Bir kulübe veya diskoya gitmek',
					'Bir konsere gitmek',
					'Hafta sonu gezisine çıkmak',
					'Bir eğlence parkına gitmek',
					'Bir müzeye veya sergiye gitmek',
					'Mağazaları gezip kendine küçük, hoş bir şey almak',
					'Keşfe çıkmak, bilinmeyen bir yeri gezmek'
				]
			},
			treats: {
				title: 'Keyif',
				items: [
					'Dondurma yemek',
					'Bir dilim pasta yemek',
					'Pizza sipariş etmek',
					'Yemek yapmak veya pasta / kek pişirmek',
					'Yeni tarifler denemek',
					'Bir yemek kursuna katılmak',
					'Arkadaşlar için yemek yapmak',
					'Bir mangal akşamı veya piknik düzenlemek'
				]
			},
			creative: {
				title: 'Yaratıcı',
				items: [
					'Resim yapmak veya çizim yapmak',
					'Seramik yapmak',
					'Dikiş dikmek veya örgü örmek',
					'El işi yapmak',
					'Yapboz veya bulmaca çözmek',
					'Yeni bir dil öğrenmek',
					'Fotoğraf çekmek',
					'Halk eğitim merkezinde bir kursa katılmak',
					'Okumak',
					'Bir şiir yazmak',
					'Müzik yapmak'
				]
			}
		},
		demo: {
			walk: 'Nehir kenarında yürüyüş yapmak',
			cinema: 'Sinemaya gitmek',
			book: 'Bir kitap okumak'
		}
	},
	riskSituations: {
		start:
			'Bu alıştırmada risk durumlarınızı yakından ele alır ve uygun kontrol stratejileri geliştirirsiniz.',
		guideShow: 'Doldurma rehberi',
		guideHide: 'Rehberi gizle',
		guideIntro:
			'Kayıtlarınızı paylaşırsanız danışmanınız bilgilerinizi okuyabilir ve size daha iyi destek olabilir. Kayıtlarınızı elbette istediğiniz zaman değiştirebilir veya silebilirsiniz. Adım adım şu şekilde ilerleyin:',
		guideSteps: {
			situation: {
				title: 'Risk durumlarını girin',
				text: '{title}: Şimdiye kadar madde kullandığınız veya sorunlu davranışı gösterdiğiniz durumları yazın.'
			},
			rating: {
				title: 'Değerlendirin',
				text: '{title}: Risk durumlarıyla başa çıkmanın zorluğu farklı olabilir. Her durumu, o durumda kararlı kalmanın sizin için ne kadar zor olacağını tahmin ederek değerlendirin.'
			},
			strategies: {
				title: 'Kontrol stratejileri geliştirin',
				text: '{title}: Bu durumlarda kontrolü elinizde tutmak ve eski davranış kalıplarına geri dönmemek için hangi olanaklarınız olduğunu düşünün. Bunlar dikkatinizi dağıtan belirli eylemler veya düşünceler olabilir.'
			},
			relapse: {
				title: 'Nüks sonrası iyileştirme',
				text: '{title}: Eski davranış kalıplarına ve alışkanlıklara geri dönerseniz, bundan çıkardığınız sonuçları önemli bir ders olarak kullanın! Kontrol stratejinizi iyileştirmek için düzenleyin. Danışmanınız bu konuda size destek olabilir.'
			}
		},
		heading: 'Risk durumlarım ve kontrol stratejilerim',
		empty: 'Henüz bir risk durumu girmediniz.',
		noSituations: 'Henüz risk durumu girilmedi.',
		deleteQuestion: 'Bu risk durumu tüm nüks analizleriyle birlikte silinsin mi?',
		delete: 'Sil',
		columns: {
			situation: 'Risk durumu',
			difficulty: 'Değerlendirme',
			strategy: 'Kontrol stratejisi',
			relapse: 'Nüks'
		},
		difficulty: { easy: 'kolay', medium: 'orta', hard: 'zor', 'very-hard': 'çok zor' },
		analyseRelapse: 'Nüksü analiz et',
		relapseState: 'Durum: {date}',
		notEdited: 'henüz düzenlenmedi',
		editLabel: 'Düzenle: {situation}',
		deleteLabel: 'Sil: {situation}',
		add: 'Yeni risk durumu gir',
		tablePdf: 'Tabloyu PDF olarak al',
		noStrategy: 'Henüz strateji yok',
		showMore: 'daha fazla göster',
		showLess: 'daha az göster',
		toOverview: 'Genel bakışa dön',
		createTitle: 'Risk durumu oluştur',
		editTitle: 'Risk durumunu düzenle',
		situationHint:
			'Madde kullandığınız veya sorunlu davranışı gösterdiğiniz ya da vazgeçmenin size zor geleceği tipik bir durumu anlatın.',
		difficultyQuestion: 'Bu durumda kararlı kalmak sizin için ne kadar zor?',
		choose: 'Lütfen seçin',
		strategyLabel: 'Kontrol / başa çıkma stratejisi',
		strategyQuestion: 'Bu durumda eski alışkanlıklara dönmekten nasıl kaçınabilirsiniz?',
		missingSituation: 'Lütfen risk durumunu anlatın.',
		missingDifficulty: 'Lütfen bir değerlendirme seçin.',
		save: 'Kaydet',
		relapseOverline: 'Nüksleri analiz et',
		relapseTitle: 'Başa çıkma stratejilerini geliştirin',
		relapseIntro:
			'Alışkanlıkları değiştirmek çoğu zaman büyük çaba gerektirir ve nadiren aksilik yaşanmadan gerçekleşir. Eski davranış kalıplarına geri döndüyseniz, yani aslında istemediğiniz hâlde örneğin içtiyseniz, esrar içtiyseniz veya kumar oynadıysanız, bunun motivasyonunuzu kırmasına izin vermeyin! Bunun yerine bu somut deneyimi, gelecekteki zorluklara daha iyi hazırlanmak için kullanın. Gelecek için ders çıkarmak amacıyla aşağıdaki soruların yardımıyla o durumu analiz edin. Danışmanınız, aksilikleri analiz etmenizde ve başa çıkma stratejileri geliştirmenizde size destek olabilir.',
		mySituation: 'Risk durumum',
		editingAnalysis: '{date} tarihli analizi düzenliyorsunuz.',
		questions: {
			circumstances:
				'1. Nüks sırasında hangi koşullar ve eşlik eden etkenler (yer, olay, orada bulunan kişiler) vardı?',
			feelings: '2. Hangi duygular veya düşünceler kararınızı etkiledi ve nükse yol açtı?',
			mainReason: '3. Sizce nükse yol açan asıl neden neydi?',
			alternatives:
				'4. Bu durumda hangi seçenekler vardı? (Somut olarak neyi farklı yapabilirdiniz? Hangi düşünceler yardımcı olabilirdi? Size kim veya ne destek olabilirdi?)',
			newStrategy:
				'5. Gelecekte bu durumun üstesinden nasıl gelebilirsiniz? (Yazdığınız cevap, bu risk durumu için otomatik olarak yeni kontrol stratejisi olarak kaydedilir.)'
		},
		previousStrategyOverline: 'Daha önce girdiğim kontrol stratejisi:',
		noPreviousStrategy: 'Henüz strateji girilmedi.',
		newStrategyPlaceholder: 'Yeni kontrol stratejinizi olabildiğince ayrıntılı anlatın',
		missingAnswer: 'Lütfen sorulardan en az birini cevaplayın.',
		pagePdf: 'Sayfayı PDF olarak al',
		allRelapses: 'Tüm nüksler',
		analysisOf: 'Analiz tarihi: {date}',
		open: 'Aç',
		close: 'Kapat',
		edit: 'Düzenle',
		answers: {
			circumstances: 'Koşullar ve eşlik eden etkenler',
			feelings: 'Duygular ve düşünceler',
			mainReason: 'Asıl neden',
			alternatives: 'Seçenekler'
		},
		previousStrategy: 'Daha önce girilen kontrol stratejisi',
		newStrategy: 'Yeni kontrol stratejisi',
		noAnswer: 'Bilgi yok',
		new: 'Yeni',
		lastChanged: 'Son değişiklik: {date}',
		pages: 'Sayfalar',
		previousPage: 'Geri',
		nextPage: 'İleri',
		pageOf: 'Sayfa {page} / {pages}',
		noRelapse: 'Kaydedilmiş nüks yok.',
		lastRelapse: 'Son nüks, analiz tarihi: {date}',
		showAllRelapses: 'Tüm nüksler ({count})',
		hideEarlierRelapses: 'Önceki nüksleri gizle',
		analysedOn: 'Analiz tarihi: {date}',
		pdfRelapses: 'Nüksler: {situation}',
		analysisGone: 'Bu analiz artık mevcut değil.',
		deleted: 'Silindi',
		demo: [
			{
				situation: 'Cuma akşamı işten sonra, iş arkadaşlarım bir şeyler içmeye gittiğinde.',
				strategy: 'Önceden spor için buluşma ayarlıyorum ve doğrudan eve gidiyorum.'
			},
			{
				situation: 'Evde yalnız olduğumda ve canım sıkıldığında.',
				strategy: 'Birini arıyorum ya da kısa bir yürüyüşe çıkıyorum.'
			}
		]
	},
	trafficLight: {
		levels: {
			red: {
				colourName: 'Kırmızı',
				danger: 'büyük tehlike',
				explanation:
					'Uzak durun, bağımlılık tehlikesi! Bu medya etkinliğinde bağımlılığa kapılmak son derece olasıdır.'
			},
			yellow: {
				colourName: 'Sarı',
				danger: 'olası tehlike',
				explanation:
					'Dikkat! Bu medya etkinliği tehlikeli hâle gelebilir. Bağımlılıktan kaçınmak için kullanımınızı yakından takip etmelisiniz.'
			},
			green: {
				colourName: 'Yeşil',
				danger: 'tehlike yok',
				explanation: 'Bu medya etkinliğini sorunsuz kullanabilirsiniz.'
			}
		},
		levelLabel: '{colour}: {danger}',
		levelOption: '{danger} ({colour})',
		intro:
			'Bu alıştırma, tek tek medya etkinliklerinin sizin için kişisel olarak ne kadar tehlikeli olduğunu değerlendirmenize ve böylece medyayı bilinçli kullanma becerinizi güçlendirmenize yardımcı olur. Trafik ışığı modeliyle medya etkinliklerini “zararsız”, “riskli” ve “kesinlikle kullanılmaması gereken” kategorilerine ayırabilirsiniz. Trafik ışığı sabit değildir; danışmanlık süresince tekrar tekrar güncellenmelidir. Amaç, tek tek etkinliklerin sizin için taşıdığı kişisel bağımlılık potansiyelini danışmanınızla birlikte olabildiğince iyi anlamanızdır.',
		instructionsTitle: 'Doldurma rehberi:',
		instructions: [
			'Bir medya etkinliği girin.',
			'Bu etkinliğe bir renk vererek bağımlılık tehlikesini değerlendirin.',
			'Düzenlemek veya silmek için bir kayda tıklayın.'
		],
		explanationsTitle: 'Renklerin anlamı:',
		legendLabel: 'Açıklama',
		lightLabel: 'Trafik ışığı',
		activityCount: { one: '{count} etkinlik', other: '{count} etkinlik' },
		noActivities: 'Etkinlik yok.',
		editActivityLabel: '{text}, {danger}: düzenle veya sil',
		add: '+ Yeni etkinlik gir',
		newTitle: 'Yeni bir medya etkinliği girin',
		editTitle: 'Etkinliği düzenle',
		activityLabel: 'Medya etkinliği',
		examplesLabel: 'Örnekler:',
		examples: [
			'Bilgisayar oyunu oynamak',
			'E-posta yazmak',
			'Film izlemek',
			'Online bankacılık işlemleri yapmak',
			'Instagram'
		],
		dangerQuestion: 'Bu etkinliğin bağımlılığa yol açma tehlikesi ne kadar yüksek?',
		missingActivity: 'Lütfen bir medya etkinliği girin.',
		missingLevel: 'Lütfen tehlikenin ne kadar yüksek olduğunu seçin.',
		cancel: 'İptal',
		save: 'Kaydet',
		delete: 'Sil',
		confirmDeleteLabel: 'Silmeyi onayla',
		confirmDelete: 'Bu etkinlik silinsin mi?',
		empty: 'Henüz etkinlik girilmedi.',
		new: 'Yeni',
		pdfLevelHeading: {
			one: '{colour}: {danger} ({count} etkinlik)',
			other: '{colour}: {danger} ({count} etkinlik)'
		},
		demo: {
			red: 'Bilgisayar oyunu oynamak',
			yellow: 'Instagram',
			green: 'E-posta yazmak'
		}
	},
	positivePerception: {
		pages: ['Giriş', 'İltifat etmek', 'İltifat etmek', 'Olumlu yanları fark etmek'],
		pageOf: 'Sayfa {page} / {count}',
		back: 'Geri',
		next: 'İleri',
		intro: [
			'Çatışmalar ve tartışmalar her sağlıklı ilişkinin bir parçası olsa da, ailedeki anlaşmazlıklar zamanla ebeveynler ile çocukları arasındaki ilişkiye çok yük olabilir. Bu, en geç olumlu şeylere çok az ilgi gösterildiğinde ya da hiç gösterilmediğinde ortaya çıkar. O zaman ailede çoğu zaman yalnızca olumsuz şeylerden şikâyet edilir; olumlu olaylar sanki hiç yokmuş gibi görünür.',
			'Bu tür bir “olumsuz ilgi”, çocuklarımızın davranışlarında yalnızca olumsuz yanları fark etmemize yol açabilir: Bir şey yolunda gitmediğinde hemen eleştirilir, iyi giden şeyleri ise çoğu zaman olağan kabul ederiz. Olumsuz yanları hemen fark edip onlara tepki verirken, olumlu yanları belki artık hiç fark etmeyiz.'
		],
		schemeIntro: [
			'Oysa iyi giden şeyleri gözden kaçırmamak yararlıdır. Olumlu şeylere ilgi göstermek, çocuklarda ve gençlerde özgüveni ve kendini koruma becerisini güçlendirir. Birbirinize davranış biçiminizdeki küçük değişiklikler bile ilişki üzerinde büyük bir etki yaratabilir. Olumlu yanlara odaklanmak aile ortamını önemli ölçüde iyileştirebilir.',
			'Olumsuz ve olumlu sözlerin çocuğunuzda neler uyandırabileceği aşağıdaki şemada açıklanmıştır. Çocuğun tepkisini görmek için sözlere tıklayın.'
		],
		remarksLabel: 'Ebeveynin sözü',
		quotedRemark: '“{remark}”',
		tones: {
			negative: 'olumsuz',
			positive: 'olumlu'
		},
		remarks: {
			clumsy: {
				remark: 'Yine çok aptalca davranıyorsun.',
				selfImage: 'ben aptalım',
				feeling: 'olumsuz / kötü',
				behaviour: 'öfkeli, huysuz'
			},
			forgetful: {
				remark: 'Bunu yine unutacağın belliydi.',
				selfImage: 'ben güvenilmezim',
				feeling: 'memnuniyetsiz, utanç',
				behaviour: 'üzgün, güvenilmez olmaya devam'
			},
			kind: {
				remark: 'Bunu yapman ne güzel.',
				selfImage: 'ben iyi biriyim',
				feeling: 'memnun',
				behaviour: 'nazik, dostça'
			},
			skilful: {
				remark: 'Bu işte ne kadar becerikli olduğuna bak.',
				selfImage: 'ben bir şeyler yapabilirim',
				feeling: 'memnun',
				behaviour: 'dostça'
			}
		},
		selfImageLabel: 'Çocuğun kendini algılayışı',
		feelingLabel: 'Çocuğun duygusu',
		behaviourLabel: 'Çocuğun olası davranışı',
		chooseRemark: 'Soldan bir söz seçin.',
		explanationPoints: [
			'“Olumsuz ilgi”, aile ortamına çok yük olabilir.',
			'Olumsuz sözler çocuğunuzun kendini algılayışı ve davranışı üzerinde olumsuz sonuçlar doğurabilir.',
			'Olumlu sözler ve övgü ise çocuğunuzun özgüvenini güçlendirir.'
		],
		explanationClosing:
			'Bu nedenle bu araç, bu olumlu yanları yeniden ön plana çıkarmayı amaçlar. Amaç, övgü ve takdir yoluyla çocuğunuzla bağınızı ve etkileşiminizi iyileştirmektir.',
		aspectsIntro:
			'Çocuğunuza olumlu geri bildirim vermenin en kolay yolu övgü veya iltifattır. Çocuğunuza yaptığınız her övgü veya iltifatla, sizin dikkatiniz de çocuğunuzun olumlu davranışlarına yönelir. Bu nedenle önce çocuğunuzun hangi davranışlarının sevindirici ve olumlu olduğunu düşünmelisiniz. Çocuğunuzun hangi davranışını, hangi etkinliğini övebilirsiniz?',
		hideHint: 'İpucunu gizle',
		showHint: 'İpucunu göster',
		aspectsHint:
			'Şunu unutmayın: İltifat, çocuğunuzun bütün kişiliğiyle değil, somut bir davranışıyla ilgilidir. Bu davranışlar basit, gündelik şeyler, hatta en azından sizin gözünüzde olağan şeyler olabilir. Elbette çocuğunuzun keyif aldığı bir davranışı veya etkinliği de övebilirsiniz. Aslında bu tür etkinlikleri desteklemek, onları geliştirmek ve böylece sorunlu davranışa (ör. bilgisayar oyunu oynamak, esrar içmek, alkol kullanmak vb.) olası bir alternatif oluşturmak için çok yararlıdır.',
		examplesTitle: 'Olumlu davranışlar şunlar olabilir:',
		examples: [
			'Ev işlerine yardım (ör. bulaşıkları yıkamak)',
			'Küçük işleri halletmek (ör. bir alışveriş yapmak)',
			'Spor yapmış olmak (veya düzenli spor yapmak)',
			'Eve zamanında gelmek',
			'Ödevlerini yapmak',
			'İyi bir not almak (veya kötü not almamak)',
			'Birinin doğum gününü hatırlamak'
		],
		inputLabel: 'Lütfen çocuğunuzun övmek istediğiniz davranışlarını ve etkinliklerini buraya yazın:',
		emptyInput: 'Lütfen önce bir şey yazın.',
		characterCount: '{length} / {max}',
		save: 'Kaydet',
		saveChange: 'Değişikliği kaydet',
		cancel: 'İptal',
		savedTitle: 'Kaydettiğiniz davranışlar',
		noEntries: 'Henüz kayıt yok.',
		confirmDelete: 'Bu kayıt silinsin mi?',
		delete: 'Sil',
		edit: 'Düzenle',
		editLabel: 'Düzenle: {text}',
		deleteLabel: 'Sil: {text}',
		counsellorTitle: 'Övülecek davranışlar ve etkinlikler',
		new: 'Yeni',
		lastChanged: 'Son değişiklik: {date}',
		demoBehaviours: ['Kendisine söylenmeden sofrayı topladı.', 'Hafta sonu futbol antrenmanına gitti.']
	}
};
