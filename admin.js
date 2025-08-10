// تطبيق إدارة العقارات والعمولات

/*
 * هذا الملف يحتوى على وظائف جافا سكريبت الخاصة بالتحقق من المستخدمين
 * وإدارة البيانات الخاصة بالعقارات والمستأجرين والصيانة والعمولات.
 * يتم تخزين البيانات فى localStorage لسهولة التجربة دون حاجة لقاعدة بيانات خلفية.
 */

/* --------------------------------------------------------------
 * تهيئة البيانات الافتراضية إذا لم تكن موجودة فى localStorage
 */
function initDefaultData() {
    // إنشاء مستخدم مدير افتراضى إذا لم يكن هناك مستخدمون
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { username: 'adminUser', password: 'pass9876', role: 'admin' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    // مصفوفات البيانات الأساسية
    if (!localStorage.getItem('properties')) localStorage.setItem('properties', '[]');
    if (!localStorage.getItem('tenants')) localStorage.setItem('tenants', '[]');
    if (!localStorage.getItem('maintenance')) localStorage.setItem('maintenance', '[]');
    if (!localStorage.getItem('commissions')) localStorage.setItem('commissions', '[]');
    if (!localStorage.getItem('appointments')) localStorage.setItem('appointments', '[]');
    if (!localStorage.getItem('notifications')) localStorage.setItem('notifications', '[]');
    if (!localStorage.getItem('archivedProperties')) localStorage.setItem('archivedProperties', '[]');
}

/* --------------------------------------------------------------
 * صفحة تسجيل الدخول
 */
if (document.getElementById('loginForm')) {
    // تهيئة البيانات الافتراضية عند تحميل صفحة الدخول
    initDefaultData();
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('loginError').innerText = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    });
}

/* --------------------------------------------------------------
 * صفحة لوحة التحكم
 * هذا القسم موجود أيضاً هنا لأننا نضمّن الملف فى كل الصفحات.
 * الكود يتحقق من عناصر الصفحة قبل العمل.
 */
if (document.getElementById('userGreeting')) {
    // عند تحميل لوحة التحكم، تحقق من تسجيل الدخول وقم بتهيئة البيانات
    initDefaultData();
    const userJSON = sessionStorage.getItem('currentUser');
    if (!userJSON) {
        // إذا لم يكن هناك مستخدم مسجل، العودة لصفحة الدخول
        window.location.href = 'login.html';
    }
    const currentUser = JSON.parse(userJSON);
    document.getElementById('userGreeting').innerText = `مرحبًا، ${currentUser.username}`;

    // تحميل البيانات من localStorage إلى متغيرات عالمية
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let properties = JSON.parse(localStorage.getItem('properties')) || [];
    let tenants = JSON.parse(localStorage.getItem('tenants')) || [];
    let maintenanceList = JSON.parse(localStorage.getItem('maintenance')) || [];
    let commissions = JSON.parse(localStorage.getItem('commissions')) || [];
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    let archivedProperties = JSON.parse(localStorage.getItem('archivedProperties')) || [];

    // وظائف مساعدة لحفظ البيانات
    function saveAll() {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('properties', JSON.stringify(properties));
        localStorage.setItem('tenants', JSON.stringify(tenants));
        localStorage.setItem('maintenance', JSON.stringify(maintenanceList));
        localStorage.setItem('commissions', JSON.stringify(commissions));
        localStorage.setItem('appointments', JSON.stringify(appointments));
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('archivedProperties', JSON.stringify(archivedProperties));
    }

    // إظهار قسم معين وإخفاء الباقى
    window.showSection = function (name) {
        const sectionIds = ['properties', 'tenants', 'maintenance', 'commissions', 'users', 'appointments', 'notifications', 'archive'];
        sectionIds.forEach(section => {
            const secEl = document.getElementById(section + 'Section');
            if (secEl) {
                secEl.style.display = (section === name) ? 'block' : 'none';
            }
        });
        switch (name) {
            case 'properties':
                renderProperties();
                break;
            case 'tenants':
                renderTenants();
                break;
            case 'maintenance':
                renderMaintenance();
                break;
            case 'commissions':
                renderCommissions();
                break;
            case 'users':
                renderUsers();
                break;
            case 'appointments':
                renderAppointments();
                break;
            case 'notifications':
                renderNotifications();
                break;
            case 'archive':
                renderArchive();
                break;
        }
    };

    function updateNotifCount(){
        const el = document.getElementById('notifCount');
        if (el) el.textContent = notifications.length ? ` (${notifications.length})` : '';
    }
    updateNotifCount();

    // عمليات تسجيل الخروج
    window.logout = function () {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };

    /* ----------------------------------------------------------
     * قسم العقارات
     */
    function renderProperties() {
        const section = document.getElementById('propertiesSection');
        let html = '<h2>العقارات</h2>';
        
        html += '<form id="propertyForm">';
        html += '<input type="hidden" id="propertyIndex">';
        html += '<label>اسم المالك</label><input type="text" id="propertyOwner" required>';
        html += '<label>اسم/عنوان العقار</label><input type="text" id="propertyName" required>';
        html += '<label>نوع العقار</label><select id="propertyType">';
        html += '<option value="شقة">شقة</option><option value="فيلا">فيلا</option><option value="أرض">أرض</option><option value="محل">محل</option>';
        html += '</select>';
        html += '<label>السعر</label><input type="number" id="propertyPrice" required>';
        html += '<label>الحالة</label><select id="propertyStatus"><option value="متاح">متاح</option><option value="مؤجر">مؤجر</option></select>';
        html += '<label>رابط الصورة</label><input type="text" id="propertyImage">';
        html += '<label>الوصف</label><textarea id="propertyDescription"></textarea>';
        html += '<button type="submit">حفظ</button>';
        html += '</form>';
        html += '<button id="exportProperties">تصدير Excel</button>';
        html += '<table class="table"><thead><tr><th>المالك</th><th>العقار</th><th>النوع</th><th>السعر</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody id="propertiesTable"></tbody></table>';

        section.innerHTML = html;
        // تعيين الأحداث
        document.getElementById('propertyForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const idx = document.getElementById('propertyIndex').value;
            
            const owner = document.getElementById('propertyOwner').value.trim();
            const name = document.getElementById('propertyName').value.trim();
            const type = document.getElementById('propertyType').value;
            const price = parseFloat(document.getElementById('propertyPrice').value);
            const status = document.getElementById('propertyStatus').value;
            const image = document.getElementById('propertyImage').value.trim();
            const description = document.getElementById('propertyDescription').value.trim();
            if (idx === '') {
                properties.push({ owner, name, type, price, status, image, description, rating:0, ratingCount:0 });
            } else {
                const old = properties[idx];
                properties[idx] = { ...old, owner, name, type, price, status, image, description };
            }
            saveAll();
            renderProperties();
        });
        document.getElementById('exportProperties').addEventListener('click', function(){
            exportToExcel('properties', properties);
        });
        // عرض الصفوف
        const tbody = document.getElementById('propertiesTable');
        tbody.innerHTML = '';
        properties.forEach((prop, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${prop.owner}</td><td>${prop.name}</td><td>${prop.type}</td><td>${prop.price}</td><td>${prop.status}</td>` +
                `<td><button onclick="editProperty(${index})">تعديل</button> <button onclick="archiveProperty(${index})">أرشفة</button></td>`;
            tbody.appendChild(tr);
        });
    }

    // تعديل عقار
    window.editProperty = function (index) {
        const prop = properties[index];
        document.getElementById('propertyIndex').value = index;
        
        document.getElementById('propertyOwner').value = prop.owner;
        document.getElementById('propertyName').value = prop.name;
        document.getElementById('propertyType').value = prop.type;
        document.getElementById('propertyPrice').value = prop.price || '';
        document.getElementById('propertyStatus').value = prop.status || 'متاح';
        document.getElementById('propertyImage').value = prop.image || '';
        document.getElementById('propertyDescription').value = prop.description || '';

    };

    // حذف عقار
    window.archiveProperty = function (index) {
        if (!confirm('هل أنت متأكد من أرشفة هذا العقار؟')) return;
        const prop = properties[index];
        properties.splice(index, 1);
        archivedProperties.push({ ...prop, archivedAt: new Date().toISOString() });
        tenants = tenants.filter(t => t.propertyName !== prop.name);
        maintenanceList = maintenanceList.filter(m => m.propertyName !== prop.name);
        commissions = commissions.filter(c => c.propertyName !== prop.name);
        saveAll();
        renderProperties();
    };

    /* ----------------------------------------------------------
     * قسم المستأجرين
     */
    function renderTenants() {
        const section = document.getElementById('tenantsSection');
        let html = '<h2>المستأجرون</h2>';
        html += '<form id="tenantForm">';
        html += '<input type="hidden" id="tenantIndex">';
        html += '<label>العقار</label><select id="tenantPropertyName" required>';
        html += '<option value="" disabled selected>اختر عقاراً</option>';
        properties.forEach(p => {
            html += `<option value="${p.name}">${p.name}</option>`;
        });
        html += '</select>';
        html += '<label>اسم المستأجر</label><input type="text" id="tenantName" required>';
        html += '<label>رقم الهاتف</label><input type="text" id="tenantPhone" required>';
        html += '<label>تاريخ بداية العقد</label><input type="date" id="leaseStart" required>';
        html += '<label>تاريخ نهاية العقد</label><input type="date" id="leaseEnd" required>';
        html += '<label>قيمة الإيجار (شهرياً)</label><input type="number" id="rentAmount" step="0.01" required>';
        html += '<button type="submit">حفظ</button>';
        html += '</form>';
        html += '<button id="exportTenants">تصدير Excel</button>';
        html += '<table class="table"><thead><tr><th>العقار</th><th>المستأجر</th><th>الهاتف</th><th>بداية العقد</th><th>نهاية العقد</th><th>الإيجار الشهري</th><th>إجراءات</th></tr></thead><tbody id="tenantsTable"></tbody></table>';
        section.innerHTML = html;
        // تعيين الحدث
        document.getElementById('tenantForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const idx = document.getElementById('tenantIndex').value;
            const propertyName = document.getElementById('tenantPropertyName').value;
            const name = document.getElementById('tenantName').value.trim();
            const phone = document.getElementById('tenantPhone').value.trim();
            const leaseStart = document.getElementById('leaseStart').value;
            const leaseEnd = document.getElementById('leaseEnd').value;
            const rentAmount = parseFloat(document.getElementById('rentAmount').value);
            if (idx === '') {
                tenants.push({ propertyName, name, phone, leaseStart, leaseEnd, rentAmount });
            } else {
                tenants[idx] = { propertyName, name, phone, leaseStart, leaseEnd, rentAmount };
            }
            saveAll();
            renderTenants();
        });
        document.getElementById('exportTenants').addEventListener('click', function(){
            exportToExcel('tenants', tenants);
        });
        // عرض الجدول
        const tbody = document.getElementById('tenantsTable');
        tbody.innerHTML = '';
        tenants.forEach((tenant, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${tenant.propertyName}</td><td>${tenant.name}</td><td>${tenant.phone}</td>` +
                `<td>${tenant.leaseStart}</td><td>${tenant.leaseEnd}</td><td>${tenant.rentAmount}</td>` +
                `<td><button onclick="editTenant(${index})">تعديل</button> <button onclick="deleteTenant(${index})">حذف</button> <button onclick="generateContract(${index})">عقد PDF</button></td>`;
            tbody.appendChild(tr);
        });
    }

    // تعديل مستأجر
    window.editTenant = function (index) {
        const tenant = tenants[index];
        document.getElementById('tenantIndex').value = index;
        document.getElementById('tenantPropertyName').value = tenant.propertyName;
        document.getElementById('tenantName').value = tenant.name;
        document.getElementById('tenantPhone').value = tenant.phone;
        document.getElementById('leaseStart').value = tenant.leaseStart;
        document.getElementById('leaseEnd').value = tenant.leaseEnd;
        document.getElementById('rentAmount').value = tenant.rentAmount;
    };

    // حذف مستأجر
    window.deleteTenant = function (index) {
        if (!confirm('هل أنت متأكد من حذف هذا المستأجر؟')) return;
        tenants.splice(index, 1);
        saveAll();
        renderTenants();
    };

    window.generateContract = function(index){
        const t = tenants[index];
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const content = `عقد إيجار\n\nالعقار: ${t.propertyName}\nالمستأجر: ${t.name}\nالهاتف: ${t.phone}\nبداية العقد: ${t.leaseStart}\nنهاية العقد: ${t.leaseEnd}\nالإيجار: ${t.rentAmount}`;
        doc.text(content, 10, 10);
        doc.save('contract.pdf');
    };

    /* ----------------------------------------------------------
     * قسم الصيانة
     */
    function renderMaintenance() {
        const section = document.getElementById('maintenanceSection');
        let html = '<h2>طلبات الصيانة</h2>';
        html += '<form id="maintenanceForm">';
        html += '<input type="hidden" id="maintenanceIndex">';
        html += '<label>العقار</label><select id="maintenancePropertyName" required>';
        html += '<option value="" disabled selected>اختر عقاراً</option>';
        properties.forEach(p => {
            html += `<option value="${p.name}">${p.name}</option>`;
        });
        html += '</select>';
        html += '<label>الوصف</label><textarea id="maintenanceDescription" required></textarea>';
        html += '<label>تاريخ الطلب</label><input type="date" id="maintenanceDate" required>';
        html += '<label>الحالة</label><select id="maintenanceStatus">';
        html += '<option value="قيد التنفيذ">قيد التنفيذ</option><option value="مغلقة">مغلقة</option>';
        html += '</select>';
        // إذا كان المستخدم مديراً يمكنه تعيين المهمة لأحد الموظفين
        if (currentUser.role === 'admin') {
            html += '<label>تعيين إلى</label><select id="maintenanceAssignedTo">';
            html += '<option value="">-- غير معين --</option>';
            users.forEach(u => {
                if (u.role !== 'admin') html += `<option value="${u.username}">${u.username}</option>`;
            });
            html += '</select>';
        }
        html += '<button type="submit">حفظ</button>';
        html += '</form>';
        html += '<table class="table"><thead><tr><th>العقار</th><th>الوصف</th><th>التاريخ</th><th>الحالة</th><th>المعين</th><th>إجراءات</th></tr></thead><tbody id="maintenanceTable"></tbody></table>';
        section.innerHTML = html;
        document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const idx = document.getElementById('maintenanceIndex').value;
            const propertyName = document.getElementById('maintenancePropertyName').value;
            const description = document.getElementById('maintenanceDescription').value.trim();
            const date = document.getElementById('maintenanceDate').value;
            const status = document.getElementById('maintenanceStatus').value;
            let assignedTo = '';
            if (currentUser.role === 'admin') {
                const assignSelect = document.getElementById('maintenanceAssignedTo');
                assignedTo = assignSelect ? assignSelect.value : '';
            } else {
                assignedTo = currentUser.username;
            }
            if (idx === '') {
                maintenanceList.push({ propertyName, description, date, status, assignedTo });
            } else {
                maintenanceList[idx] = { propertyName, description, date, status, assignedTo };
            }
            saveAll();
            renderMaintenance();
        });
        // عرض الجدول
        const tbody = document.getElementById('maintenanceTable');
        tbody.innerHTML = '';
        maintenanceList.forEach((req, index) => {
            // يمكن للموظف رؤية الطلبات الخاصة به فقط، أما المدير فيرى جميع الطلبات
            if (currentUser.role !== 'admin' && req.assignedTo && req.assignedTo !== currentUser.username) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${req.propertyName}</td><td>${req.description}</td><td>${req.date}</td><td>${req.status}</td><td>${req.assignedTo || ''}</td>` +
                `<td><button onclick="editMaintenance(${index})">تعديل</button> <button onclick="deleteMaintenance(${index})">حذف</button></td>`;
            tbody.appendChild(tr);
        });
    }

    // تعديل طلب صيانة
    window.editMaintenance = function (index) {
        const req = maintenanceList[index];
        // إذا كان الموظف غير مسموح له بتعديل طلب ليس له، تجاهل
        if (currentUser.role !== 'admin' && req.assignedTo !== currentUser.username) return;
        document.getElementById('maintenanceIndex').value = index;
        document.getElementById('maintenancePropertyName').value = req.propertyName;
        document.getElementById('maintenanceDescription').value = req.description;
        document.getElementById('maintenanceDate').value = req.date;
        document.getElementById('maintenanceStatus').value = req.status;
        if (currentUser.role === 'admin' && document.getElementById('maintenanceAssignedTo')) {
            document.getElementById('maintenanceAssignedTo').value = req.assignedTo || '';
        }
    };

    // حذف طلب صيانة
    window.deleteMaintenance = function (index) {
        const req = maintenanceList[index];
        if (currentUser.role !== 'admin' && req.assignedTo !== currentUser.username) return;
        if (!confirm('هل أنت متأكد من حذف طلب الصيانة؟')) return;
        maintenanceList.splice(index, 1);
        saveAll();
        renderMaintenance();
    };

    /* ----------------------------------------------------------
     * قسم العمولات
     */
    function renderCommissions() {
        const section = document.getElementById('commissionsSection');
        let html = '<h2>العمولات</h2>';
        html += '<form id="commissionForm">';
        html += '<input type="hidden" id="commissionIndex">';
        html += '<label>نوع العملية</label><select id="commissionType">';
        html += '<option value="تأجير">تأجير</option><option value="بيع">بيع</option><option value="شراء">شراء</option>';
        html += '</select>';
        html += '<label>العقار (اختياري)</label><select id="commissionPropertyName">';
        html += '<option value="">-- لا يوجد --</option>';
        properties.forEach(p => {
            html += `<option value="${p.name}">${p.name}</option>`;
        });
        html += '</select>';
        html += '<label>المبلغ</label><input type="number" id="commissionAmount" step="0.01" required>';
        html += '<label>نسبة العمولة (%)</label><input type="number" id="commissionPercentage" step="0.01" required>';
        html += '<label>الموظف</label><select id="commissionEmployee">';
        users.forEach(u => {
            if (u.role !== 'admin') html += `<option value="${u.username}">${u.username}</option>`;
        });
        html += '</select>';
        html += '<label>تاريخ العملية</label><input type="date" id="commissionDate" required>';
        html += '<button type="submit">حفظ</button>';
        html += '</form>';
        html += '<table class="table"><thead><tr><th>النوع</th><th>العقار</th><th>المبلغ</th><th>النسبة</th><th>العمولة</th><th>الموظف</th><th>التاريخ</th><th>إجراءات</th></tr></thead><tbody id="commissionsTable"></tbody></table>';
        section.innerHTML = html;
        document.getElementById('commissionForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const idx = document.getElementById('commissionIndex').value;
            const type = document.getElementById('commissionType').value;
            const propertyName = document.getElementById('commissionPropertyName').value;
            const amount = parseFloat(document.getElementById('commissionAmount').value);
            const percentage = parseFloat(document.getElementById('commissionPercentage').value);
            const employee = document.getElementById('commissionEmployee').value;
            const date = document.getElementById('commissionDate').value;
            const commissionValue = amount * (percentage / 100);
            if (idx === '') {
                commissions.push({ type, propertyName, amount, percentage, commissionValue, employee, date });
            } else {
                commissions[idx] = { type, propertyName, amount, percentage, commissionValue, employee, date };
            }
            saveAll();
            renderCommissions();
        });
        const tbody = document.getElementById('commissionsTable');
        tbody.innerHTML = '';
        commissions.forEach((com, index) => {
            // الموظف يرى العمولات الخاصة به فقط، أما المدير فيرى الجميع
            if (currentUser.role !== 'admin' && com.employee !== currentUser.username) return;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${com.type}</td><td>${com.propertyName || ''}</td><td>${com.amount}</td>` +
                `<td>${com.percentage}%</td><td>${com.commissionValue.toFixed(2)}</td>` +
                `<td>${com.employee}</td><td>${com.date}</td>` +
                `<td><button onclick="editCommission(${index})">تعديل</button> <button onclick="deleteCommission(${index})">حذف</button></td>`;
            tbody.appendChild(tr);
        });
    }

    // تعديل عمولة
    window.editCommission = function (index) {
        const com = commissions[index];
        // إذا كان الموظف غير مدير ولا يملك هذا السجل، لا يسمح بالتعديل
        if (currentUser.role !== 'admin' && com.employee !== currentUser.username) return;
        document.getElementById('commissionIndex').value = index;
        document.getElementById('commissionType').value = com.type;
        document.getElementById('commissionPropertyName').value = com.propertyName;
        document.getElementById('commissionAmount').value = com.amount;
        document.getElementById('commissionPercentage').value = com.percentage;
        document.getElementById('commissionEmployee').value = com.employee;
        document.getElementById('commissionDate').value = com.date;
    };

    // حذف عمولة
    window.deleteCommission = function (index) {
        const com = commissions[index];
        if (currentUser.role !== 'admin' && com.employee !== currentUser.username) return;
        if (!confirm('هل أنت متأكد من حذف سجل العمولة؟')) return;
        commissions.splice(index, 1);
        saveAll();
        renderCommissions();
    };

    /* ----------------------------------------------------------
     * قسم المستخدمين (للمدير فقط)
     */
    function renderUsers() {
        const section = document.getElementById('usersSection');
        if (currentUser.role !== 'admin') {
            // إذا لم يكن مديراً، إخفاء هذا القسم
            section.innerHTML = '<p>لا تملك صلاحية الوصول إلى هذا القسم.</p>';
            return;
        }
        let html = '<h2>المستخدمون</h2>';
        html += '<form id="userForm">';
        html += '<input type="hidden" id="userIndex">';
        html += '<label>اسم المستخدم</label><input type="text" id="newUsername" required>';
        html += '<label>كلمة المرور</label><input type="password" id="newPassword" required>';
        html += '<label>الدور</label><select id="newRole">';
        html += '<option value="employee">موظف</option><option value="admin">مدير</option>';
        html += '</select>';
        html += '<button type="submit">حفظ</button>';
        html += '</form>';
        html += '<table class="table"><thead><tr><th>اسم المستخدم</th><th>الدور</th><th>إجراءات</th></tr></thead><tbody id="usersTable"></tbody></table>';
        section.innerHTML = html;
        document.getElementById('userForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const idx = document.getElementById('userIndex').value;
            const username = document.getElementById('newUsername').value.trim();
            const password = document.getElementById('newPassword').value;
            const role = document.getElementById('newRole').value;
            if (idx === '') {
                // التأكد من عدم تكرار اسم المستخدم
                if (users.find(u => u.username === username)) {
                    alert('اسم المستخدم موجود بالفعل');
                    return;
                }
                users.push({ username, password, role });
            } else {
                // تحديث مستخدم
                users[idx] = { username, password, role };
            }
            saveAll();
            renderUsers();
        });
        // عرض جدول المستخدمين
        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';
        users.forEach((user, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${user.username}</td><td>${user.role === 'admin' ? 'مدير' : 'موظف'}</td>` +
                `<td>${user.username !== currentUser.username ? `<button onclick=\"editUser(${index})\">تعديل</button> <button onclick=\"deleteUser(${index})\">حذف</button>` : ''}</td>`;
            tbody.appendChild(tr);
        });
    }

    // تعديل مستخدم
    window.editUser = function (index) {
        const user = users[index];
        document.getElementById('userIndex').value = index;
        document.getElementById('newUsername').value = user.username;
        document.getElementById('newPassword').value = user.password;
        document.getElementById('newRole').value = user.role;
    };

    // حذف مستخدم
    window.deleteUser = function (index) {
        if (users[index].username === currentUser.username) return;
        if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
        users.splice(index, 1);
        saveAll();
        renderUsers();
    };

    /* ----------------------------------------------------------
     * قسم المواعيد
     */
    function renderAppointments(){
        const section = document.getElementById('appointmentsSection');
        let html = '<h2>المواعيد</h2>';
        html += '<table class="table"><thead><tr><th>الاسم</th><th>الهاتف</th><th>العقار</th><th>التاريخ</th></tr></thead><tbody>';
        appointments.forEach(a => {
            html += `<tr><td>${a.name}</td><td>${a.phone}</td><td>${a.property}</td><td>${a.date}</td></tr>`;
        });
        html += '</tbody></table>';
        section.innerHTML = html;
    }

    /* ----------------------------------------------------------
     * قسم الإشعارات
     */
    function renderNotifications(){
        const section = document.getElementById('notificationsSection');
        let html = '<h2>الإشعارات</h2>';
        if(notifications.length===0){
            html += '<p>لا توجد إشعارات</p>';
        }else{
            html += '<ul>';
            notifications.forEach(n=>{
                html += `<li>${n.message} - ${n.date}</li>`;
            });
            html += '</ul>';
        }
        html += '<button id="clearNotifications">مسح الإشعارات</button>';
        section.innerHTML = html;
        const btn = document.getElementById('clearNotifications');
        if(btn) btn.addEventListener('click', ()=>{
            notifications = [];
            saveAll();
            renderNotifications();
            updateNotifCount();
        });
        updateNotifCount();
    }

    /* ----------------------------------------------------------
     * قسم الأرشيف
     */
    function renderArchive(){
        const section = document.getElementById('archiveSection');
        let html = '<h2>الأرشيف</h2>';
        html += '<table class="table"><thead><tr><th>المالك</th><th>العقار</th><th>النوع</th><th>السعر</th></tr></thead><tbody>';
        archivedProperties.forEach(p=>{
            html += `<tr><td>${p.owner}</td><td>${p.name}</td><td>${p.type}</td><td>${p.price}</td></tr>`;
        });
        html += '</tbody></table>';
        section.innerHTML = html;
    }

    function exportToExcel(filename, data){
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, filename + '.xlsx');
    }

    // عند فتح لوحة التحكم لأول مرة، عرض قسم العقارات افتراضياً
    showSection('properties');
}

