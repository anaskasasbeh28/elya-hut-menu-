/* =========================================================================
   Elya Hut — ALL menu content lives here, in both languages.
   To change a price: edit the number. To add an item: copy one line.
   Sources (see README.md): the café's printed counter boards (video 1),
   the yellow food board, the IG "المنيو" highlight, and the printed
   "إبريق شاي" A-frame poster. Where they disagree, the printed board wins.
   Loaded as a plain <script> (not JSON + fetch) so it works from file://.

   DISH PHOTOS: run  python tools/add_photo.py photo.jpg KEY  and give the
   dish  photo: "KEY"  plus an  alt  text. Dishes with a photo get a thumbnail
   and open the photo when tapped; dishes without one stay plain rows.
   ========================================================================= */
window.ELYA_MENU = {
  brand: {
    name:  { ar: "كُوخ إيلياء", en: "Elya Hut" },
    tag:   { ar: "Coffee & Baked Goods", en: "Coffee & Baked Goods" },
    since: { ar: "منذ ٢٠٢٦", en: "Since 2026" },
    welcome: {
      ar: "أهلاً بكم في كوخ إيلياء، مساحتكم الخاصة للقهوة، المخبوزات الطازجة، والفن.",
      en: "Welcome to Elya Hut, your own space for coffee, fresh bakes and art."
    },
    pets: { ar: "نرحب بجميع أصدقائكم الأليفين", en: "Your pets are always welcome" }
  },

  contact: {
    // Digit groups are joined with U+00A0 (no-break space) — see BRIEF.md rule 2.
    phoneDisplay: "07 9090 1669",
    phoneHref: "tel:+962790901669",
    whatsappDisplay: "07 9090 1666",
    whatsappHref: "https://wa.me/962790901666",
    mapHref: "https://maps.app.goo.gl/e6cExN3aK3XdpRHx6",
    instagramHref: "https://www.instagram.com/kukhelia.jo",
    facebookHref: "https://www.facebook.com/profile.php?id=61594105678957",
    address: {
      ar: "جبل اللويبدة، شارع الشريعة، بجانب مكتبة الشريعة",
      en: "Jabal Al‑Weibdeh, Al‑Sharia Street, next to Al‑Sharia Library"
    },
    hours: {
      ar: "يومياً من 7:00 صباحاً حتى 12:00 منتصف الليل",
      en: "Daily, 7:00 AM to midnight"
    }
  },

  ui: {
    langSwitch:   { ar: "English", en: "عربي" },
    langSwitchAria: { ar: "Switch to English", en: "التحويل إلى العربية" },
    skip:         { ar: "تخطَّ إلى المنيو", en: "Skip to the menu" },
    navLabel:     { ar: "أقسام المنيو", en: "Menu sections" },
    priceNote:    { ar: "الأسعار بالدينار الأردني", en: "Prices in Jordanian dinars" },
    currency:     { ar: "دينار", en: "JD" },
    open:         { ar: "مفتوح الآن · حتى 12 منتصف الليل", en: "Open now · until midnight" },
    closed:       { ar: "مغلق الآن · نفتح 7:00 صباحاً", en: "Closed now · opens 7:00 AM" },
    hoursLabel:   { ar: "الدوام", en: "Hours" },
    addressLabel: { ar: "العنوان", en: "Address" },
    map:          { ar: "الموقع على الخريطة", en: "Open in Maps" },
    call:         { ar: "اتصال", en: "Call" },
    whatsapp:     { ar: "واتساب", en: "WhatsApp" },
    instagram:    { ar: "انستغرام", en: "Instagram" },
    facebook:     { ar: "فيسبوك", en: "Facebook" },
    viewPhoto:    { ar: "عرض الصورة", en: "View photo" },
    close:        { ar: "إغلاق", en: "Close" },
    pageTitle:    { ar: "المنيو · كُوخ إيلياء", en: "Menu · Elya Hut" }
  },

  sections: [
    {
      id: "tea-kaak",
      kind: "offers",
      title: { ar: "شاي وكعك", en: "Tea & Ka’ak" },
      items: [
        {
          name: { ar: "كعك مع شاي", en: "Ka’ak with Tea" },
          price: 2.50,
          img: "assets/img/offers/kaak-tea.webp", w: 720, h: 540,
          alt: { ar: "كعك في سلة مفروشة بقماش كاروهات وجنبه إبريق شاي أخضر", en: "Ka’ak in a gingham-lined basket beside a green enamel teapot" }
        },
        {
          name: { ar: "إبريق شاي", en: "Teapot of Tea" },
          sub:  { ar: "مع قطعة كيكة برتقال أو شوكولاتة", en: "with a slice of orange or chocolate cake" },
          price: 4.60,
          img: "assets/img/offers/teapot-cake.webp", w: 518, h: 388,
          alt: { ar: "شاي بينصبّ من الإبريق بكاسة وجنبه قطعة كيكة برتقال", en: "Tea poured from the pot into a glass beside a slice of orange cake" }
        }
      ]
    },
    {
      id: "coffee",
      title: { ar: "القهوة", en: "Coffee" },
      items: [
        { name: { ar: "لاتيه كوخ إيلياء", en: "Elya Cottage Latte" }, price: 4.50 },
        { name: { ar: "سبانيش لاتيه", en: "Spanish Latte" }, price: 3.25 },
        { name: { ar: "قهوة تركية", en: "Turkish Coffee" }, price: 1.50, photo: "turkish",
          alt: { ar: "فنجانين قهوة تركية على صينية خشب", en: "Two cups of Turkish coffee on a wooden tray" } },
        { name: { ar: "أمريكانو", en: "Americano" }, price: 2.25, photo: "americano",
          alt: { ar: "فنجان أمريكانو سخن على صحن أبيض", en: "A hot americano in a white cup and saucer" } },
        { name: { ar: "كابتشينو", en: "Cappuccino" }, price: 2.75 },
        { name: { ar: "لاتيه", en: "Latte" }, price: 2.75 },
        { name: { ar: "دبل إسبريسو", en: "Double Espresso" }, price: 2.25 }
      ]
    },
    {
      id: "iced-coffee",
      title: { ar: "القهوة الباردة", en: "Iced Coffee" },
      items: [
        { name: { ar: "آيس أمريكانو", en: "Iced Americano" }, price: 2.50, photo: "iced-americano",
          alt: { ar: "كاستين آيس أمريكانو بغطا شفاف على صينية خشب", en: "Two iced americanos with clear lids on a wooden tray" } },
        { name: { ar: "آيس لاتيه", en: "Iced Latte" }, price: 3.00 },
        { name: { ar: "آيس سبانيش لاتيه", en: "Iced Spanish Latte" }, price: 3.50 },
        { name: { ar: "آيس كراميل لاتيه", en: "Iced Caramel Latte" }, price: 3.50 },
        { name: { ar: "آيس فانيلا لاتيه", en: "Iced Vanilla Latte" }, price: 3.50 }
      ]
    },
    {
      id: "drinks",
      title: { ar: "المشروبات", en: "Drinks" },
      items: [
        { name: { ar: "منعش الكوخ", en: "Hut Refresher" }, price: 4.50 },
        { name: { ar: "موهيتو ليمون ونعناع", en: "Lemon Mint Mojito" }, price: 2.75 },
        { name: { ar: "آيس تي خوخ", en: "Peach Iced Tea" }, price: 2.50 },
        { name: { ar: "شاي أخضر بالهيل / إنجليزي", en: "Green Tea with Cardamom / English Tea" }, price: 2.00 }
      ]
    },
    {
      id: "food",
      title: { ar: "طعام", en: "Food" },
      items: [
        { name: { ar: "سندويشة مكدوس ولبنة", en: "Makdous & Labneh Sandwich" }, price: 1.80 },
        { name: { ar: "سندويشة تركي وجبنة", en: "Turkey & Cheese Sandwich" }, price: 3.80, photo: "turkey-cheese",
          alt: { ar: "سندويشة بخبز الشياباتا مقسومة نصين على صحن مورّد أزرق", en: "A ciabatta sandwich cut in half on a blue floral plate" } },
        { name: { ar: "سندويشة حلوم", en: "Halloumi Sandwich" }, price: 2.80 },
        { name: { ar: "سندويشة حلوم بالسوردو", en: "Sourdough Halloumi Sandwich" }, price: 4.80 },
        { name: { ar: "سندويشة تونة", en: "Tuna Sandwich" }, price: 3.50 },
        { name: { ar: "توست مربى وزبدة", en: "Butter & Jam Toast" }, price: 4.50 },
        { name: { ar: "صحن جرانولا باللبن", en: "Yogurt & Granola Bowl" }, price: 4.20, photo: "granola",
          alt: { ar: "صحن جرانولا باللبن مع موز وخوخ وجنبه كابتشينو", en: "Granola and yogurt bowl with banana and peach, beside a cappuccino" } },
        { name: { ar: "إندومي بخلطة الكوخ الخاصة", en: "Special Indomie" }, price: 2.50 },
        { name: { ar: "فطيرة كوخ إيلياء باللحمة", en: "Elya Hut Beef Pie" }, price: 6.00, photo: "pie",
          alt: { ar: "فطيرة كوخ إيلياء بالجبنة المحمّرة على فوطة كاروهات خضرا", en: "Elya Hut beef pie with golden baked cheese on a green gingham napkin" } }
      ]
    }
  ]
};
