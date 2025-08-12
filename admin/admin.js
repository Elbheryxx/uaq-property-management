const PASSWORD = 'b@dboy';
const SESSION_KEY = 'adminSession';
const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours

function checkSession() {
  const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  if (data && Date.now() - data.time < SESSION_DURATION) {
    showDashboard();
  }
}

function showDashboard() {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const val = document.getElementById('adminPassword').value;
  if (val === PASSWORD) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({time: Date.now()}));
    showDashboard();
  } else {
    alert('خطأ في كلمة السر');
  }
});

checkSession();
