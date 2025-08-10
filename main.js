window.addEventListener('DOMContentLoaded', () => {
    // إعداد بيانات عقارات تجريبية إذا لم تكن موجودة
    if (!localStorage.getItem('properties') || JSON.parse(localStorage.getItem('properties')).length === 0) {
        const sample = [
            {owner:'محمد', name:'شقة حديثة', type:'شقة', price:50000, status:'متاح', image:'https://via.placeholder.com/300x200', description:'', rating:4, ratingCount:1},
            {owner:'محمد', name:'فيلا فاخرة', type:'فيلا', price:200000, status:'مؤجر', image:'https://via.placeholder.com/300x200', description:'', rating:5, ratingCount:2},
            {owner:'محمد', name:'محل تجاري', type:'محل', price:75000, status:'متاح', image:'https://via.placeholder.com/300x200', description:'', rating:3, ratingCount:1}
        ];
        localStorage.setItem('properties', JSON.stringify(sample));
    }
    let properties = JSON.parse(localStorage.getItem('properties'));
    const bookingSelect = document.getElementById('bookProperty');

    function saveProperties(){
        localStorage.setItem('properties', JSON.stringify(properties));
    }

    function populateBookingOptions(){
        if(bookingSelect){
            bookingSelect.innerHTML='';
            properties.forEach(p=>{
                const opt=document.createElement('option');
                opt.value=p.name;
                opt.textContent=p.name;
                bookingSelect.appendChild(opt);
            });
        }
    }

    function renderStars(container, rating){
        container.innerHTML='';
        const idx = container.dataset.index;
        for(let i=1;i<=5;i++){
            const star=document.createElement('span');
            star.textContent='★';
            star.className='star' + (i <= Math.round(rating) ? ' filled' : '');
            star.addEventListener('click', () => {
                const prop=properties[idx];
                const count=prop.ratingCount || 0;
                prop.rating = ((prop.rating || 0) * count + i) / (count + 1);
                prop.ratingCount = count + 1;
                saveProperties();
                renderProperties();
            });
            container.appendChild(star);
        }
    }

    function renderProperties(){
        const list=document.getElementById('propertiesList');
        const search=document.getElementById('searchInput').value.toLowerCase();
        const filter=document.getElementById('typeFilter').value;
        list.innerHTML='';
        properties.filter(p => p.name.toLowerCase().includes(search) && (filter==='' || p.type===filter)).forEach((prop,index) => {
            const card=document.createElement('div');
            card.className='property';
            card.innerHTML=`<img src="${prop.image || 'https://via.placeholder.com/300x200'}" alt="">`+
                `<h3>${prop.name}</h3>`+
                `<p class="price">${prop.price}</p>`+
                `<p class="type">${prop.type}</p>`+
                `<p class="status">${prop.status}</p>`+
                `<div class="rating" data-index="${index}"></div>`+
                `<a class="call" href="tel:0508911211" data-i18n="call">اتصل الآن</a>`+
                `<a class="whatsapp" href="https://wa.me/971508911211">واتساب</a>`;
            list.appendChild(card);
            renderStars(card.querySelector('.rating'), prop.rating || 0);
        });
        updateI18n();
        populateBookingOptions();
    }

    document.getElementById('searchInput').addEventListener('input', renderProperties);
    document.getElementById('typeFilter').addEventListener('change', renderProperties);

    const bookingForm=document.getElementById('bookingForm');
    if(bookingForm){
        bookingForm.addEventListener('submit', e=>{
            e.preventDefault();
            const name=document.getElementById('bookName').value.trim();
            const phone=document.getElementById('bookPhone').value.trim();
            const property=document.getElementById('bookProperty').value;
            const date=document.getElementById('bookDate').value;
            const appointments=JSON.parse(localStorage.getItem('appointments')||'[]');
            appointments.push({name, phone, property, date});
            localStorage.setItem('appointments', JSON.stringify(appointments));
            const notifications=JSON.parse(localStorage.getItem('notifications')||'[]');
            notifications.push({message:`موعد جديد من ${name} للعقار ${property}`, date:new Date().toLocaleString()});
            localStorage.setItem('notifications', JSON.stringify(notifications));
            bookingForm.reset();
            alert('تم إرسال الموعد');
        });
    }

    // --- الترجمة ---
    const i18n = {
        ar: {
            title:'محمد المستشار العقاري',
            aboutTitle:'من أنا',
            aboutText:'أنا محمد، مستشار عقاري بخبرة تزيد عن 7 سنوات في أم القيوين وأقدم جميع الخدمات العقارية.',
            servicesTitle:'الخدمات',
            service1:'إدارة وتأجير جميع أنواع العقارات',
            service2:'استشارات عقارية متكاملة',
            propertiesTitle:'العقارات المتاحة',
            searchPlaceholder:'بحث',
            all:'الكل', apt:'شقق', villa:'فلل', land:'أراضٍ', shop:'محلات',
            testimonialsTitle:'شهادات العملاء',
            faqTitle:'الأسئلة الشائعة', faqLink:'الأسئلة الشائعة',
            privacyLink:'سياسة الخصوصية',
            contactTitle:'تواصل معي',
            call:'اتصل الآن',
            mapTitle:'موقعي',
            bookTitle:'حجز موعد',
            bookName:'الاسم',
            bookPhone:'الهاتف',
            bookProperty:'العقار',
            bookDate:'التاريخ',
            bookSubmit:'إرسال'
        },
        en: {
            title:'Mohamed Real Estate Consultant',
            aboutTitle:'About Me',
            aboutText:'I am Mohamed, a real estate consultant with over 7 years of experience in Umm Al Quwain.',
            servicesTitle:'Services',
            service1:'Management and leasing of all property types',
            service2:'Comprehensive real estate consultations',
            propertiesTitle:'Available Properties',
            searchPlaceholder:'Search',
            all:'All', apt:'Apartments', villa:'Villas', land:'Lands', shop:'Shops',
            testimonialsTitle:'Testimonials',
            faqTitle:'FAQ', faqLink:'FAQ',
            privacyLink:'Privacy Policy',
            contactTitle:'Contact',
            call:'Call Now',
            mapTitle:'Location',
            bookTitle:'Book Appointment',
            bookName:'Name',
            bookPhone:'Phone',
            bookProperty:'Property',
            bookDate:'Date',
            bookSubmit:'Submit'
        }
    };
    let currentLang='ar';

    function updateI18n(){
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key=el.getAttribute('data-i18n');
            if(i18n[currentLang][key]) el.textContent=i18n[currentLang][key];
        });
        document.getElementById('searchInput').setAttribute('placeholder', i18n[currentLang].searchPlaceholder);
        document.querySelectorAll('#typeFilter option').forEach(opt=>{
            const key=opt.getAttribute('data-i18n');
            if(i18n[currentLang][key]) opt.textContent=i18n[currentLang][key];
        });
    }
    function setLang(lang){
        currentLang=lang;
        document.documentElement.lang=lang;
        document.documentElement.dir=(lang==='ar'?'rtl':'ltr');
        document.getElementById('langToggle').textContent=(lang==='ar'?'EN':'ع');
        updateI18n();
        renderProperties();
    }
    document.getElementById('langToggle').addEventListener('click', ()=>{
        setLang(currentLang==='ar'?'en':'ar');
    });

    setLang(currentLang);
    renderProperties();
});
