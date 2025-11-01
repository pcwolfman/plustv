// TV Kanalları Veritabanı
const channels = [
    {
        id: 1,
        name: "TRT 1",
        category: "entertainment",
        icon: "📺",
        url: "https://trt.daioncdn.net/trt-1/master.m3u8?app=web",
        type: "m3u8"
    },
    {
        id: 2,
        name: "ATV",
        category: "entertainment",
        icon: "📺",
        url: "https://trkvz-live.daioncdn.net/atv/atv.m3u8",
        type: "m3u8"
    },
    {
        id: 3,
        name: "STAR TV",
        category: "entertainment",
        icon: "📺",
        url: "https://dogus-live.daioncdn.net/startv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 4,
        name: "SHOW TV",
        category: "entertainment",
        icon: "📺",
        url: "https://ciner-live.daioncdn.net/showtv/showtv.m3u8",
        type: "m3u8"
    },
    {
        id: 5,
        name: "KANAL D",
        category: "entertainment",
        icon: "📺",
        url: "https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web&ce=3",
        type: "m3u8"
    },
    {
        id: 6,
        name: "KANAL 7",
        category: "entertainment",
        icon: "📺",
        url: "https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8",
        type: "m3u8"
    },
    {
        id: 7,
        name: "NOW TV",
        category: "entertainment",
        icon: "📺",
        url: "https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8",
        type: "m3u8"
    },
    {
        id: 8,
        name: "360 TV",
        category: "entertainment",
        icon: "📺",
        url: "https://turkmedya-live.ercdn.net/tv360/tv360.m3u8",
        type: "m3u8"
    },
    {
        id: 9,
        name: "TV4",
        category: "entertainment",
        icon: "📺",
        url: "https://turkmedya-live.ercdn.net/tv4/tv4.m3u8",
        type: "m3u8"
    },
    {
        id: 10,
        name: "TEVE 2",
        category: "entertainment",
        icon: "📺",
        url: "https://demiroren-live.daioncdn.net/teve2/teve2.m3u8",
        type: "m3u8"
    },
    {
        id: 11,
        name: "TV 8",
        category: "entertainment",
        icon: "📺",
        url: "https://tv8-live.daioncdn.net/tv8/tv8.m3u8",
        type: "m3u8"
    },
    {
        id: 12,
        name: "TV 8.5",
        category: "entertainment",
        icon: "📺",
        url: "https://tv8.daioncdn.net/tv8bucuk/tv8bucuk_1080p.m3u8?app=tv8bucuk_web&ce=3",
        type: "m3u8"
    },
    {
        id: 13,
        name: "BEYAZ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8",
        type: "m3u8"
    },
    {
        id: 14,
        name: "TRT BELGESEL",
        category: "movie",`n        icon: "ğŸ¬",
        url: "https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 15,
        name: "TLC",
        category: "movie",`n        icon: "ğŸ¬",
        url: "https://dogus-live.daioncdn.net/tlc/tlc.m3u8",
        type: "m3u8"
    },
    {
        id: 16,
        name: "DMAX TV",
        category: "movie",`n        icon: "ğŸ¬",
        url: "https://dogus-live.daioncdn.net/dmax/dmax.m3u8",
        type: "m3u8"
    },
    {
        id: 17,
        name: "NTV",
        category: "news",
        icon: "📰",
        url: "https://dogus-live.daioncdn.net/ntv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 18,
        name: "TRT HABER",
        category: "news",
        icon: "📰",
        url: "https://tv-trthaber.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 19,
        name: "HABERGLOBAL",
        category: "news",
        icon: "📰",
        url: "http://trn03.tulix.tv/gt-haberglobal/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 20,
        name: "HABERTÜRK",
        category: "news",
        icon: "📰",
        url: "https://ciner-live.daioncdn.net/haberturktv/haberturktv_1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 21,
        name: "TGRT HABER",
        category: "news",
        icon: "📰",
        url: "https://tgrthaber-live.daioncdn.net/tgrthaber/tgrthaber.m3u8",
        type: "m3u8"
    },
    {
        id: 22,
        name: "A HABER",
        category: "news",
        icon: "📰",
        url: "https://trkvz-live.ercdn.net/ahaberhd/ahaberhd.m3u8",
        type: "m3u8"
    },
    {
        id: 23,
        name: "AKiT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://akittv-live.ercdn.net/akittv/akittv_720p.m3u8",
        type: "m3u8"
    },
    {
        id: 24,
        name: "ÜLKE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 25,
        name: "TV100",
        category: "entertainment",
        icon: "📺",
        url: "https://tv100-live.daioncdn.net/tv100/tv100_1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 26,
        name: "HALK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://halktv-live.daioncdn.net/halktv/halktv_1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 27,
        name: "TELE1",
        category: "entertainment",
        icon: "📺",
        url: "https://tele1-live.ercdn.net/tele1/tele1_1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 28,
        name: "TVNET",
        category: "entertainment",
        icon: "📺",
        url: "https://mn-nl.mncdn.com/tvnet/tvnet/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 29,
        name: "24 TV",
        category: "entertainment",
        icon: "📺",
        url: "https://turkmedya-live.ercdn.net/tv24/tv24_720p.m3u8",
        type: "m3u8"
    },
    {
        id: 30,
        name: "A PARA",
        category: "entertainment",
        icon: "📺",
        url: "https://trkvz-live.ercdn.net/aparahd/aparahd.m3u8",
        type: "m3u8"
    },
    {
        id: 31,
        name: "BENGÜ TÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://ensonhaber-live.ercdn.net/benguturk/benguturk.m3u8",
        type: "m3u8"
    },
    {
        id: 32,
        name: "EKOL TV",
        category: "entertainment",
        icon: "📺",
        url: "https://ekoltv-live.ercdn.net/ekoltv/ekoltv.m3u8",
        type: "m3u8"
    },
    {
        id: 33,
        name: "TV5",
        category: "entertainment",
        icon: "📺",
        url: "https://tv5-live.ercdn.net/tv5/tv5.m3u8",
        type: "m3u8"
    },
    {
        id: 34,
        name: "FLASH HABER",
        category: "news",
        icon: "📰",
        url: "https://internettv.guventechnology.com:19360/flashhabertv/1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 35,
        name: "TH TURK HABER TV",
        category: "news",
        icon: "📰",
        url: "https://edge1.socialsmart.tv/turkhaber/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 36,
        name: "HABER 61",
        category: "news",
        icon: "📰",
        url: "http://win8.yayin.com.tr/haber61tv/smil:haber61tv.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 37,
        name: "A2",
        category: "entertainment",
        icon: "📺",
        url: "https://trkvz-live.daioncdn.net/a2tv/a2tv.m3u8",
        type: "m3u8"
    },
    {
        id: 38,
        name: "EURO D",
        category: "entertainment",
        icon: "📺",
        url: "https://live.duhnet.tv/S2/HLS_LIVE/eurodnp/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 39,
        name: "SHOW TÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://canlitvulusal.xyz/live/showturk/index.m3u8",
        type: "m3u8"
    },
    {
        id: 40,
        name: "SHOW MAX",
        category: "entertainment",
        icon: "📺",
        url: "https://raw.githubusercontent.com/ipstreet312/freeiptv/master/ressources/tur/shmax.m3u8",
        type: "m3u8"
    },
    {
        id: 41,
        name: "KANAL 7 AVRUPA",
        category: "entertainment",
        icon: "📺",
        url: "https://livetv.radyotvonline.net/kanal7live/kanal7avr/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 42,
        name: "TRT 2",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trt2.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 43,
        name: "TRT TÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtturk.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 44,
        name: "TRT AVAZ",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtavaz.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 45,
        name: "TRT MÜZiK",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtmuzik.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 46,
        name: "KRAL POP TV FHD",
        category: "music",`n        icon: "ğŸµ",
        url: "http://dygvideo.dygdigital.com/live/hls/kralpop",
        type: "m3u8"
    },
    {
        id: 47,
        name: "KRAL POP TV",
        category: "music",`n        icon: "ğŸµ",
        url: "https://dogus-live.daioncdn.net/kralpoptv/kralpoptv_720p.m3u8",
        type: "m3u8"
    },
    {
        id: 48,
        name: "TATLISES TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_tatlisestv/tatlisestv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 49,
        name: "DREAM TURK",
        category: "entertainment",
        icon: "📺",
        url: "https://live.duhnet.tv//S2/HLS_LIVE/dreamturknp/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 50,
        name: "NR 1 TURK",
        category: "entertainment",
        icon: "📺",
        url: "https://b01c02nl.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e187770143.smil/chunklist_b400000.m3u8",
        type: "m3u8"
    },
    {
        id: 51,
        name: "POWER LOVE",
        category: "music",`n        icon: "ğŸµ",
        url: "https://listen.powerapp.com.tr/plove/love.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 52,
        name: "NR 1 DAMAR",
        category: "entertainment",
        icon: "📺",
        url: "https://b01c02nl.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e19877b340.smil/chunklist_b400000.m3u8?md5=api5VtN5dEXl5cvRHMQBNQ&expires=1696713505",
        type: "m3u8"
    },
    {
        id: 53,
        name: "NR 1 TV",
        category: "entertainment",
        icon: "📺",
        url: "https://b01c02nl.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e17cd59e8b.smil/chunklist_b400000.m3u8",
        type: "m3u8"
    },
    {
        id: 54,
        name: "POWER TURK",
        category: "music",`n        icon: "ğŸµ",
        url: "https://livetv.powerapp.com.tr/powerturkTV/powerturkhd.smil/playlists.m3u8",
        type: "m3u8"
    },
    {
        id: 55,
        name: "POWER TURK SLOW",
        category: "music",`n        icon: "ğŸµ",
        url: "https://listen.powerapp.com.tr/pturkslow/slow.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 56,
        name: "POWER TV AKUSTiK",
        category: "music",`n        icon: "ğŸµ",
        url: "https://listen.powerapp.com.tr/pturkakustik/akustik.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 57,
        name: "POWER TURK TAPTAZE",
        category: "music",`n        icon: "ğŸµ",
        url: "https://listen.powerapp.com.tr/pturktaptaze/taptaze.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 58,
        name: "POWER DANCE",
        category: "music",`n        icon: "ğŸµ",
        url: "https://listen.powerapp.com.tr/dance/dance.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 59,
        name: "POWER TV",
        category: "music",`n        icon: "ğŸµ",
        url: "https://livetv.powerapp.com.tr/powerTV/powerhd.smil/chunklist_b1428000_sltur.m3u8",
        type: "m3u8"
    },
    {
        id: 60,
        name: "SLOW KARADENIZ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://yayin.slowkaradeniztv.com:3390/multi_web/play.m3u8",
        type: "m3u8"
    },
    {
        id: 61,
        name: "ASPOR",
        category: "sports",
        icon: "⚽",
        url: "https://trkvz-live.daioncdn.net/aspor/aspor.m3u8",
        type: "m3u8"
    },
    {
        id: 62,
        name: "HT SPOR",
        category: "sports",
        icon: "⚽",
        url: "https://ciner-live.ercdn.net/htspor/htspor.m3u8",
        type: "m3u8"
    },
    {
        id: 63,
        name: "TRT SPOR",
        category: "sports",
        icon: "⚽",
        url: "https://tv-trtspor1.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 64,
        name: "TRT SPOR YILDIZ",
        category: "sports",
        icon: "⚽",
        url: "https://tv-trtspor2.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 65,
        name: "GS TV",
        category: "entertainment",
        icon: "📺",
        url: "https://owifavo5.rocketcdn.com/gstv/gstv.smil/master.m3u8",
        type: "m3u8"
    },
    {
        id: 66,
        name: "FB TV",
        category: "entertainment",
        icon: "📺",
        url: "https://1hskrdto.rocketcdn.com/fenerbahcetv.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 67,
        name: "SPORTS TV",
        category: "sports",
        icon: "⚽",
        url: "https://live.sportstv.com.tr/hls/low/sportstv_fhd/index.m3u8",
        type: "m3u8"
    },
    {
        id: 68,
        name: "MELTEM TV",
        category: "entertainment",
        icon: "📺",
        url: "https://vhxyrsly.rocketcdn.com/meltemtv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 69,
        name: "GZT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://mn-nl.mncdn.com/gzttv/gzttv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 70,
        name: "TYT TÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-tytturk.yayin.com.tr/tytturk/index.m3u8",
        type: "m3u8"
    },
    {
        id: 71,
        name: "TGRT EU",
        category: "news",
        icon: "📰",
        url: "https://tgrt-live.ercdn.net/tgrteu/tgrteu.m3u8",
        type: "m3u8"
    },
    {
        id: 72,
        name: "TGRT BELGESEL",
        category: "news",
        icon: "📰",
        url: "https://tgrt-live.ercdn.net/tgrtbelgesel/tgrtbelgesel.m3u8",
        type: "m3u8"
    },
    {
        id: 73,
        name: "ONS TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-onstv.yayin.com.tr/onstv/index.m3u8",
        type: "m3u8"
    },
    {
        id: 74,
        name: "CİNE 1",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_cine1/cine1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 75,
        name: "CİNE 5",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-cine5tv.yayin.com.tr/cine5tv/cine5tv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 76,
        name: "CİNE 6",
        category: "entertainment",
        icon: "📺",
        url: "https://canli.cine6tv.com.tr:3614/stream/play.m3u8",
        type: "m3u8"
    },
    {
        id: 77,
        name: "CİNEMAX 6",
        category: "entertainment",
        icon: "📺",
        url: "https://ip240.radyotelekom.com.tr:3118/stream/play.m3u8",
        type: "m3u8"
    },
    {
        id: 78,
        name: "TiViTURK",
        category: "entertainment",
        icon: "📺",
        url: "https://stream.tiviturk.de/live/tiviturk.m3u8",
        type: "m3u8"
    },
    {
        id: 79,
        name: "DENiZ POSTASI TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_denizpostasi/denizpostasi/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 80,
        name: "İSVİÇRE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://i41.ozelip.com:3269/hybrid/play.m3u8",
        type: "m3u8"
    },
    {
        id: 81,
        name: "DİZİ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://playlist.fasttvcdn.com/pl/rfrk9821hdy9dayo8wfyha/dizi-tv/playlist/0.m3u8",
        type: "m3u8"
    },
    {
        id: 82,
        name: "SUPERTURK TV",
        category: "entertainment",
        icon: "📺",
        url: "http://75.119.144.48/SUPERTURK_TV_STREAM/index.m3u8",
        type: "m3u8"
    },
    {
        id: 83,
        name: "SUPERTURK MAX",
        category: "entertainment",
        icon: "📺",
        url: "http://75.119.144.48/SUPERTURK_MAX_HD/index.m3u8",
        type: "m3u8"
    },
    {
        id: 84,
        name: "ViYANA TV",
        category: "entertainment",
        icon: "📺",
        url: "http://nrttn172.kesintisizyayin.com:29010/nrttn/nrttn/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 85,
        name: "DOST TV",
        category: "entertainment",
        icon: "📺",
        url: "https://dost.stream.emsal.im/tv/live.m3u8",
        type: "m3u8"
    },
    {
        id: 86,
        name: "DiYANET TV",
        category: "entertainment",
        icon: "📺",
        url: "http://eustr73.mediatriple.net/videoonlylive/mtikoimxnztxlive/broadcast_5e3bf95a47e07.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 87,
        name: "GONCA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/goncatv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 88,
        name: "LALEGUL TV",
        category: "entertainment",
        icon: "📺",
        url: "https://lbl.netmedya.net/hls/lalegultv.m3u8",
        type: "m3u8"
    },
    {
        id: 89,
        name: "SEMERKAND TV",
        category: "entertainment",
        icon: "📺",
        url: "http://b01c02nl.mediatriple.net/videoonlylive/mtisvwurbfcyslive/broadcast_58d915bd40efc.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 90,
        name: "SEMERKAND TV WAY",
        category: "entertainment",
        icon: "📺",
        url: "https://b01c02nl.mediatriple.net/videoonlylive/mtisvwurbfcyslive/broadcast_6409fdaa68111.smil/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 91,
        name: "REHBER TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn4.yayin.com.tr/rehbertv/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 92,
        name: "KUDUS TV",
        category: "entertainment",
        icon: "📺",
        url: "https://yayin30.haber100.com/live/kudustv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 93,
        name: "KANAL ON 4 TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/on4/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 94,
        name: "AL ZAHRA TURK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.al-zahratv.com/live/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 95,
        name: "HADİ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.ishiacloud.com/hls/37166b77-128d-425c-91bf-8195071c217d_720p.m3u8",
        type: "m3u8"
    },
    {
        id: 96,
        name: "İLK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://592f1881b3d5f.streamlock.net:1443/santraltv_294/santraltv_294/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 97,
        name: "MC TV",
        category: "entertainment",
        icon: "📺",
        url: "https://rrr.sz.xlcdn.com/?account=mceutv&file=mc2&type=live&service=wowza&protocol=https&output=playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 98,
        name: "MUKABELE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://playlist.fasttvcdn.com/pl/rfrk9821hdy9dayo8wfyha/mukabele-tv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 99,
        name: "Al QURAN KAREEM - KABE CANLI",
        category: "entertainment",
        icon: "📺",
        url: "https://al-ekhbaria-prod-dub.shahid.net/out/v1/9885cab0a3ec4008b53bae57a27ca76b/index.m3u8",
        type: "m3u8"
    },
    {
        id: 100,
        name: "TRT COCUK",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtcocuk.medya.trt.com.tr/master_720.m3u8",
        type: "m3u8"
    },
    {
        id: 101,
        name: "TRT DİYANET ÇOCUK",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtdiyanetcocuk.medya.trt.com.tr/master_720.m3u8",
        type: "m3u8"
    },
    {
        id: 102,
        name: "BRT 2 KIBRIS",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/brt2hd/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 103,
        name: "MİNİKA GO",
        category: "entertainment",
        icon: "📺",
        url: "https://trkvz-live.daioncdn.net/minikago/minikago.m3u8",
        type: "m3u8"
    },
    {
        id: 104,
        name: "MİNİKA ÇOÇUK",
        category: "entertainment",
        icon: "📺",
        url: "https://trkvz-live.daioncdn.net/minikago_cocuk/minikago_cocuk.m3u8",
        type: "m3u8"
    },
    {
        id: 105,
        name: "CARTOONNETWORK BLUTV",
        category: "entertainment",
        icon: "📺",
        url: "https://cartoonnetwork.blutv.com/blutv_cartoonnetwork/live.m3u8",
        type: "m3u8"
    },
    {
        id: 106,
        name: "TÜRKMENELİ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://135962.global.ssl.fastly.net/5ff366a512987e2c0a3dabfe/live_14378e1002eb11ef9cb025207067897a/index.fmp4.m3u8",
        type: "m3u8"
    },
    {
        id: 107,
        name: "BRT 1 KIBRIS",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/brt1hd/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 108,
        name: "KIBRIS ADA",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/adatv/bant1/chunklist_w2073141101.m3u8",
        type: "m3u8"
    },
    {
        id: 109,
        name: "KTV  KIBRIS",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/kibristv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 110,
        name: "KUZEY KIBRIS",
        category: "entertainment",
        icon: "📺",
        url: "https://kuzeykibris.tv/m3u8/kktv.m3u8",
        type: "m3u8"
    },
    {
        id: 111,
        name: "KIBRIS GENÇ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/kibrisgenctv/bant1/chunklist_w248136165.m3u8",
        type: "m3u8"
    },
    {
        id: 112,
        name: "KANAL T",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/kanalt/bantp1/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 113,
        name: "SİM TV",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/simtv/bantp1/chunklis.m3u8",
        type: "m3u8"
    },
    {
        id: 114,
        name: "TV 2020",
        category: "entertainment",
        icon: "📺",
        url: "https://sc-kuzeykibrissmarttv.ercdn.net/tv2020/bantp1/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 115,
        name: "AGRO TV",
        category: "entertainment",
        icon: "📺",
        url: "https://yayin30.haber100.com/live/agrotv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 116,
        name: "AKSU TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_aksutv/aksutv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 117,
        name: "ANADOLUNET TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_anadolunet/anadolunet/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 118,
        name: "ANGARA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://angr.radyotvonline.net/webtv/smil:kecioren.smil/chunklist_w976368300_b3268000_sltur.m3u8",
        type: "m3u8"
    },
    {
        id: 119,
        name: "ARAS TV",
        category: "entertainment",
        icon: "📺",
        url: "https://2.rtmp.org/tv217/yayin.stream/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 120,
        name: "BİR TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/birtv/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 121,
        name: "BODRUM KENT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/bodrumkenttv/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 122,
        name: "BRTV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_brtv/brtv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 123,
        name: "BURSA LiNE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/linetv/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 124,
        name: "BURSA ON6 TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal16/kanal16/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 125,
        name: "CAY TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/caytv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 126,
        name: "ÇİFTÇİ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 127,
        name: "DEHA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_dehatv/dehatv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 128,
        name: "DERiN TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn1-derintv.yayin.com.tr/derintv/derintv/chunklist_w1486394141_b1796000.m3u8",
        type: "m3u8"
    },
    {
        id: 129,
        name: "DİM TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_dimtv/dimtv/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 130,
        name: "EDİRNE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://yayin.edirnetv.com:8088/hls/etvcanliyayin.m3u8",
        type: "m3u8"
    },
    {
        id: 131,
        name: "EDESSA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tv170.radyotelekom.com.tr:21764/edessatv/edessatv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 132,
        name: "EDiRNE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://yayin.edirnetv.com:8088/hls/etvcanliyayin.m3u8",
        type: "m3u8"
    },
    {
        id: 133,
        name: "ERCİYES TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_erciyestv/erciyestv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 134,
        name: "ERCiS TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn1-ercistv.yayin.com.tr/ercistv/amlst:ercistv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 135,
        name: "ER TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_ertv_new/ertv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 136,
        name: "ES TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_estv/estv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 137,
        name: "ETV KAYSERi",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_etv/etv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 138,
        name: "ETV MANiSA",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/manisaetv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 139,
        name: "FRT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/frttv/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 140,
        name: "FORTUNA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/ftvturk/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 141,
        name: "GRT GAZİANTEP TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_grt/grt/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 142,
        name: "GUNEYDOGU TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/gtv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 143,
        name: "GURBET 24 TV",
        category: "entertainment",
        icon: "📺",
        url: "http://cdn-gurbet24.yayin.com.tr/gurbet24/gurbet24/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 144,
        name: "HUNAT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_hunattv/hunattv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 145,
        name: "iCEL TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/iceltv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 146,
        name: "İZMİR TIME 35 TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-time35tv.yayin.com.tr/time35tv/time35tv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 147,
        name: "İKRA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_diyartv/diyartv/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 148,
        name: "KARDELEN TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/kardelentv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 149,
        name: "KANAL 3",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal3/kanal3/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 150,
        name: "KANAL 12",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal12/kanal12/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 151,
        name: "KANAL 13",
        category: "entertainment",
        icon: "📺",
        url: "https://medya.kesintisizyayin.com:3423/stream/play.m3u8",
        type: "m3u8"
    },
    {
        id: 152,
        name: "KANAL 15",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal15/kanal15/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 153,
        name: "KANAL 19",
        category: "entertainment",
        icon: "📺",
        url: "https://live.euromediacenter.com/kanal19/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 154,
        name: "KANAL 23",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal23/kanal23/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 155,
        name: "KANAL 26",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal26/kanal26/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 156,
        name: "KANAL 28",
        category: "entertainment",
        icon: "📺",
        url: "https://ip252.ozelip.com:22524/kanalg/kanalg/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 157,
        name: "KANAL 32",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/kanal32/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 158,
        name: "KANAL 33",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/kanal33/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 159,
        name: "KANAL 34",
        category: "entertainment",
        icon: "📺",
        url: "https://live.euromediacenter.com/kanal34/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 160,
        name: "KANAL 53",
        category: "entertainment",
        icon: "📺",
        url: "https://kanal53.ozelip.com:3448/hybrid/play.m3u8",
        type: "m3u8"
    },
    {
        id: 161,
        name: "KANAL 56",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-kanal56tv.yayin.com.tr/kanal56tv/kanal56tv/chunklist_w559405215.m3u8",
        type: "m3u8"
    },
    {
        id: 162,
        name: "KANAL 58",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal58/kanal58/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 163,
        name: "KANAL 68",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanal68/kanal68/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 164,
        name: "KANAL ADA",
        category: "entertainment",
        icon: "📺",
        url: "http://145.239.58.133:28008/kanalada/kanalada/sec-f5-v1-a1.m3u8?app=supersatforum",
        type: "m3u8"
    },
    {
        id: 165,
        name: "KANAL AVRUPA",
        category: "entertainment",
        icon: "📺",
        url: "https://api-tv27.yayin.com.tr/kanalavrupa/index.m3u8",
        type: "m3u8"
    },
    {
        id: 166,
        name: "KANAL B",
        category: "entertainment",
        icon: "📺",
        url: "https://baskentaudiovideo.xyz/LiveApp/streams/mUE22idl26lA1683879097431.m3u8",
        type: "m3u8"
    },
    {
        id: 167,
        name: "KANAL S",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-kanals.yayin.com.tr/kanals/kanals/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 168,
        name: "KANAL V",
        category: "entertainment",
        icon: "📺",
        url: "https://waw1.artiyerelmedya.net/kanalv/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 169,
        name: "KANAL Z",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanalz/kanalz/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 170,
        name: "KANAL PLUS",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanalplus/kanalplus/mpeg/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 171,
        name: "KANAL URFA",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/kanalurfa/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 172,
        name: "KANAL FIRAT",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kanalfirat/kanalfirat/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 173,
        name: "KAY TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_kaytv/kaytv1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 174,
        name: "KOCAELİ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/kocaelitv/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 175,
        name: "KTV KONYA",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-ktvtv.yayin.com.tr/ktvtv/ktvtv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 176,
        name: "LİFE TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_lifetv/lifetv/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 177,
        name: "MAVi KARADENiZ TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_mavikaradeniz/mavikaradeniz/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 178,
        name: "MERCAN TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_mercantv/mercantv/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 179,
        name: "METROPOL TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/metropoltv/smil/metropoltv/bant1/chunks.m3u8?app=supersatforum",
        type: "m3u8"
    },
    {
        id: 180,
        name: "MUGLA TÜRK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/muglaturk/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 181,
        name: "NORA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_noratv/noratv/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 182,
        name: "OLAY TURK",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_olayturk/olayturk/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 183,
        name: "SUN TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_sunrtv/sunrtv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 184,
        name: "TARIM TV",
        category: "entertainment",
        icon: "📺",
        url: "https://content.tvkur.com/l/c7e1da7mm25p552d9u9g/index-1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 185,
        name: "TEMPO TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 186,
        name: "TiVi 6",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_tivi6/tivi6/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 187,
        name: "TOKAT WEB TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-tokattvwebtv.yayin.com.tr/tokattvwebtv/tokattvwebtv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 188,
        name: "TON TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_tontv/tontv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 189,
        name: "TRAKYA TÜRK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_trakyaturk/trakyaturk/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 190,
        name: "TÜRK KLİNİKLERİ TV",
        category: "entertainment",
        icon: "📺",
        url: "http://mn-nl.mncdn.com/turkiyeklinikleri/smil:turkiyeklinikleri/chunklist_b3128000.m3u8",
        type: "m3u8"
    },
    {
        id: 191,
        name: "TV 25",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-tv25.yayin.com.tr/tv25/tv25/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 192,
        name: "TV 41",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_tv41/tv41/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 193,
        name: "TV 48",
        category: "entertainment",
        icon: "📺",
        url: "https://ajansplay.com:5443/LiveApp/streams/tv48.m3u8",
        type: "m3u8"
    },
    {
        id: 194,
        name: "TV 52",
        category: "entertainment",
        icon: "📺",
        url: "https://edge1.socialsmart.tv/tv52/bant1/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 195,
        name: "TV 264",
        category: "entertainment",
        icon: "📺",
        url: "https://b01c02nl.mediatriple.net/videoonlylive/mtdxkkitgbrckilive/broadcast_5ee244263fd6d.smil/playlist.m3u8?md5=qb_9l3erQIDqZMjbKfALzA&expires=1651666386",
        type: "m3u8"
    },
    {
        id: 196,
        name: "TV A",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_tva/tva/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 197,
        name: "UR FANATiK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_urfanatiktv/urfanatiktv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 198,
        name: "TOKAT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn-tokattv.yayin.com.tr/tokattv/tokattv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 199,
        name: "URFA HABER TV",
        category: "news",
        icon: "📰",
        url: "https://ruhatv.ozelip.com:3483/stream/play.m3u8",
        type: "m3u8"
    },
    {
        id: 200,
        name: "VAN GOLU TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn1-vangolutv.yayin.com.tr/vangolutv/amlst:vangolutv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 201,
        name: "VRT",
        category: "entertainment",
        icon: "📺",
        url: "https://vrttv.ozelip.com:3644/multi_web/play_720.m3u8",
        type: "m3u8"
    },
    {
        id: 202,
        name: "VTV TÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://ip252.ozelip.com:22524/marstv/marstv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 203,
        name: "VUSLAT TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_vuslattv/vuslattv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 204,
        name: "WOMAN TV",
        category: "entertainment",
        icon: "📺",
        url: "https://s01.webcaster.cloud/wmtv/live_1080p.m3u8",
        type: "m3u8"
    },
    {
        id: 205,
        name: "WORLDTÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://live.artidijitalmedya.com/artidijital_worldturk/worldturk/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 206,
        name: "RIZE TURK HD",
        category: "entertainment",
        icon: "📺",
        url: "https://yayin.rizeturk.com:3777/hybrid/play.m3u8",
        type: "m3u8"
    },
    {
        id: 207,
        name: "PAZARCIK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://pazarciktv.ozelip.net:3962/hybrid/play.m3u8",
        type: "m3u8"
    },
    {
        id: 208,
        name: "ORDU BEL TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn1-ordubeltv.yayin.com.tr/ordubeltv/ordubeltv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 209,
        name: "YOZGAT BLD TV",
        category: "entertainment",
        icon: "📺",
        url: "https://cdn1-yozgatbeltv.yayin.com.tr/yozgatbeltv/yozgatbeltv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 210,
        name: "FiNEST TV",
        category: "entertainment",
        icon: "📺",
        url: "http://media.finest.tv/hls/live.m3u8",
        type: "m3u8"
    },
    {
        id: 211,
        name: "DAMAR TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tv.php?kanal=damar&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 212,
        name: "ARABESK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tv.php?kanal=arabeskyeni&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 213,
        name: "SILA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tv.php?kanal=silatv&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 214,
        name: "ZEYNO TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tv.php?kanal=zeynotv&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 215,
        name: "DOST TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tvz.php?kanal=dost&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 216,
        name: "EZO TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tvz.php?kanal=ezo&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 217,
        name: "TOP POP TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tvz.php?kanal=toppop&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 218,
        name: "A VİVA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tv.php?kanal=vivatv&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 219,
        name: "ARMA TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tvz.php?kanal=arma&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 220,
        name: "GENC SMS TV",
        category: "entertainment",
        icon: "📺",
        url: "https://tvsms.club/tv.php?kanal=genctv&file=.m3u8",
        type: "m3u8"
    },
    {
        id: 221,
        name: "TRT WORLD",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtworld.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 222,
        name: "TRT KURDi",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtkurdi.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 223,
        name: "TRT ARABi",
        category: "entertainment",
        icon: "📺",
        url: "https://tv-trtarabi.medya.trt.com.tr/master.m3u8",
        type: "m3u8"
    },
    {
        id: 224,
        name: "SAGLIK CHANEL",
        category: "entertainment",
        icon: "📺",
        url: "https://live.euromediacenter.com/saglikchannel/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 225,
        name: "5 OCAK TV",
        category: "entertainment",
        icon: "📺",
        url: "https://592f1881b3d5f.streamlock.net/5ocaktv/5ocaktv/chunklist_w1939638168.m3u8",
        type: "m3u8"
    },
    {
        id: 226,
        name: "ALANYA ATV",
        category: "entertainment",
        icon: "📺",
        url: "https://helga.iptv2022.com/sh/AlanyaTV/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 227,
        name: "TAŞ TV",
        category: "entertainment",
        icon: "📺",
        url: "http://palatv34.ozelip.com:22372/tastv/tastv/chunklist.m3u8",
        type: "m3u8"
    },
    {
        id: 228,
        name: "HÜR TV",
        category: "entertainment",
        icon: "📺",
        url: "https://live.euromediacenter.com/hurtv/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    },
    {
        id: 229,
        name: "AYZ",
        category: "entertainment",
        icon: "📺",
        url: "http://164.132.23.92:22372/ayztv/ayztv/playlist.m3u8",
        type: "m3u8"
    },
    {
        id: 230,
        name: "BELEMTÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://edge.socialsmart.tv/belemturktv/bant1/chunks.m3u8",
        type: "m3u8"
    },
    {
        id: 231,
        name: "BRÜKSEL TÜRK",
        category: "entertainment",
        icon: "📺",
        url: "https://live.euromediacenter.com/brukselturk/tracks-v1a1/mono.m3u8",
        type: "m3u8"
    }
];

// Global Değişkenler
let currentChannel = null;
let isMuted = true;
let currentCategory = 'all';
let filteredChannels = channels;

// DOM Elementleri
const channelList = document.getElementById('channelList');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const videoPlaceholder = document.querySelector('.video-placeholder');
const currentChannelInfo = document.getElementById('currentChannelInfo');
const currentChannelName = document.getElementById('currentChannelName');
const currentChannelCategory = document.getElementById('currentChannelCategory');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const loading = document.getElementById('loading');

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    renderChannels();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Arama
    searchInput.addEventListener('input', handleSearch);
    
    // Kategori Filtreleme
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterAndRender();
        });
    });

    // Tam Ekran
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Ses Kontrolü
    volumeBtn.addEventListener('click', toggleVolume);
    
    // Video Çift Tıklama ile Tam Ekran
    videoContainer.addEventListener('dblclick', toggleFullscreen);
    videoPlayer.addEventListener('dblclick', toggleFullscreen);
    
    // Video Oynatıcı Event'leri
    videoPlayer.addEventListener('play', () => {
        videoPlaceholder.style.display = 'none';
    });
    
    videoPlayer.addEventListener('error', handleVideoError);
}

// Kanal Listesi Render
function renderChannels() {
    channelList.innerHTML = '';
    
    if (filteredChannels.length === 0) {
        channelList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Kanal bulunamadı</p>';
        return;
    }
    
    filteredChannels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        channelItem.innerHTML = `
            <div class="channel-icon">${channel.icon}</div>
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
                <div class="channel-category">${getCategoryName(channel.category)}</div>
            </div>
        `;
        
        channelItem.addEventListener('click', () => playChannel(channel));
        channelList.appendChild(channelItem);
    });
}

// Kanal Oynat
function playChannel(channel) {
    if (!channel || !channel.url) {
        showError('Geçersiz kanal bilgisi.');
        return;
    }
    
    currentChannel = channel;
    
    // Önceki oynatıcıyı durdur ve temizle
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load(); // Player'ı sıfırla
    
    // Önceki HLS instance'ını temizle
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    iframePlayer.src = '';
    iframePlayer.style.display = 'none';
    
    // Loading göster
    loading.style.display = 'flex';
    
    // Aktif kanalı vurgula
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
        const itemName = item.querySelector('.channel-name').textContent;
        if (itemName === channel.name) {
            item.classList.add('active');
        }
    });
    
    // Kanal bilgisini güncelle
    currentChannelName.textContent = channel.name;
    currentChannelCategory.textContent = getCategoryName(channel.category);
    currentChannelInfo.style.display = 'block';
    
    // Video oynat
    if (channel.type === 'm3u8') {
        playM3U8(channel.url);
    } else if (channel.type === 'iframe') {
        playIframe(channel.url);
    } else {
        loading.style.display = 'none';
        showError('Desteklenmeyen kanal tipi.');
    }
}

// M3U8 Oynat
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    iframePlayer.style.display = 'none';
    videoPlaceholder.style.display = 'none';
    
    // HLS.js yüklenmesini bekle
    if (typeof Hls === 'undefined') {
        // HLS.js henüz yüklenmedi, bekle
        let attempts = 0;
        const maxAttempts = 100; // 10 saniye (100ms * 100)
        
        const checkHls = setInterval(() => {
            attempts++;
            if (typeof Hls !== 'undefined') {
                clearInterval(checkHls);
                playM3U8(url); // Tekrar dene
            } else if (attempts >= maxAttempts) {
                clearInterval(checkHls);
                loading.style.display = 'none';
                showError('HLS.js yüklenemedi. Lütfen sayfayı yenileyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 100);
        return;
    }
    
    // HLS.js kullanarak M3U8 oynat
    if (Hls.isSupported()) {
        // Önceki HLS instance'ını temizle
        if (videoPlayer.hls) {
            videoPlayer.hls.destroy();
        }
        
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            debug: false,
            xhrSetup: function(xhr, url) {
                xhr.withCredentials = false;
            }
        });
        
        videoPlayer.hls = hls;
        
        hls.loadSource(url);
        hls.attachMedia(videoPlayer);
        
        let manifestParsed = false;
        let timeout;
        
        const clearTimeoutSafe = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            manifestParsed = true;
            clearTimeoutSafe();
            videoPlayer.play().catch(err => {
                console.error('Oynatma hatası:', err);
                loading.style.display = 'none';
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            });
            loading.style.display = 'none';
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Hatası:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Ağ hatası, yeniden deneniyor...');
                        try {
                            hls.startLoad();
                        } catch(e) {
                            console.error('Yeniden yükleme hatası:', e);
                            loading.style.display = 'none';
                            hls.destroy();
                            showError('Ağ hatası. İnternet bağlantınızı kontrol edin.');
                            videoPlaceholder.style.display = 'flex';
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Medya hatası, düzeltiliyor...');
                        try {
                            hls.recoverMediaError();
                        } catch(e) {
                            console.error('Medya hatası düzeltilemedi:', e);
                            loading.style.display = 'none';
                            hls.destroy();
                            showError('Video çözümlenemedi. Lütfen başka bir kanal deneyin.');
                            videoPlaceholder.style.display = 'flex';
                        }
                        break;
                    default:
                        clearTimeoutSafe();
                        loading.style.display = 'none';
                        hls.destroy();
                        showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
                        videoPlaceholder.style.display = 'flex';
                        break;
                }
            }
        });
        
        // Timeout ekle - manifest 15 saniye içinde yüklenmezse hata ver
        timeout = setTimeout(() => {
            if (!manifestParsed) {
                loading.style.display = 'none';
                hls.destroy();
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 15000);
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari için native HLS desteği
        videoPlayer.src = url;
        const playPromise = videoPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                loading.style.display = 'none';
            }).catch(err => {
                console.error('Oynatma hatası:', err);
                loading.style.display = 'none';
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        } else {
            loading.style.display = 'none';
        }
        
        // Timeout ekle - Safari için
        const safariTimeout = setTimeout(() => {
            if (videoPlayer.readyState === 0) {
                loading.style.display = 'none';
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 15000);
        
        videoPlayer.addEventListener('loadeddata', () => {
            clearTimeout(safariTimeout);
        }, { once: true });
    } else {
        loading.style.display = 'none';
        showError('Tarayıcınız bu video formatını desteklemiyor.');
    }
}

// Iframe Oynat
function playIframe(url) {
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'block';
    iframePlayer.src = url;
    loading.style.display = 'none';
}

// Video Hatası
function handleVideoError(e) {
    loading.style.display = 'none';
    console.error('Video hatası:', e);
    
    // HLS instance'ını temizle
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    let errorMessage = 'Video yüklenemedi.';
    
    if (videoPlayer.error) {
        switch(videoPlayer.error.code) {
            case videoPlayer.error.MEDIA_ERR_ABORTED:
                errorMessage = 'Video yükleme iptal edildi.';
                break;
            case videoPlayer.error.MEDIA_ERR_NETWORK:
                errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
                break;
            case videoPlayer.error.MEDIA_ERR_DECODE:
                errorMessage = 'Video çözümlenemedi.';
                break;
            case videoPlayer.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Video formatı desteklenmiyor.';
                break;
        }
    }
    
    showError(errorMessage + ' Lütfen başka bir kanal deneyin.');
    
    // Placeholder'ı göster
    videoPlaceholder.style.display = 'flex';
}

// Hata Göster
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--danger);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Arama
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterAndRender(searchTerm);
}

// Filtrele ve Render
function filterAndRender(searchTerm = '') {
    filteredChannels = channels.filter(channel => {
        const matchesCategory = currentCategory === 'all' || channel.category === currentCategory;
        const matchesSearch = searchTerm === '' || 
            channel.name.toLowerCase().includes(searchTerm) ||
            getCategoryName(channel.category).toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    renderChannels();
}

// Kategori Adını Al
function getCategoryName(category) {
    const names = {
        'news': 'Haber',
        'sports': 'Spor',
        'entertainment': 'Eğlence',
        'movie': 'Sinema',
        'music': 'Müzik'
    };
    return names[category] || category;
}

// Tam Ekran
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            console.error('Tam ekran hatası:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Ses Aç/Kapat
function toggleVolume() {
    isMuted = !isMuted;
    videoPlayer.muted = isMuted;
    volumeIcon.textContent = isMuted ? '🔇' : '🔊';
}

// HLS.js Script Yükle (M3U8 desteği için) - Eğer head'de yüklenmemişse
if (typeof Hls === 'undefined') {
    const hlsScript = document.createElement('script');
    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    hlsScript.onerror = () => {
        console.error('HLS.js yüklenemedi. Kanal oynatma çalışmayabilir.');
    };
    hlsScript.onload = () => {
        console.log('HLS.js başarıyla yüklendi.');
    };
    document.head.appendChild(hlsScript);
} else {
    console.log('HLS.js zaten yüklü.');
}

// Klavye Kısayolları
document.addEventListener('keydown', (e) => {
    // Space: Oynat/Duraklat
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    }
    
    // F: Tam Ekran
    if (e.code === 'KeyF') {
        toggleFullscreen();
    }
    
    // M: Ses Aç/Kapat
    if (e.code === 'KeyM') {
        toggleVolume();
    }
});


