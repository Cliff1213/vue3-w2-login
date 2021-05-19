console.clear();
// api info
const url = 'https://vue3-course-api.hexschool.io/';
const path = 'alvin-vue-api';

// Dom Get
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const loginBtn = document.querySelector('#login');

// 事件監聽
loginBtn.addEventListener('click', login);
function login() { // 取出 token 並將 token 存入 cookie
    let username = usernameInput.value;
    let password = passwordInput.value;

    const data = {
        "username": username, // 相同可縮寫
        "password": password
    }

    if (username !== '' && password !== '') {
        // Post 發送登入請求
        axios.post(`${url}admin/signin`, data)
        .then((res) => {
            // console.log(res.data);
            if (res.data.success) {
                const { token, expired } = res.data; // 解構賦值
                // console.log(token, expired);
                document.cookie = `myToken=${token}; expires=${new Date(expired)}; path=/`;
                alert(res.data.message);

                app.init(); // 登入成功後取得產品列表
                usernameInput.value = ''; // ? 請問這裡寫成 username = '' 為什麼沒辦法清空輸入的值呢?
                passwordInput.value = '';
            } else {
                alert(res.data.message);
                usernameInput.value = '';
                passwordInput.value = '';
            }
        })

    } else {
        alert('帳號密碼不能為空白');
    }
}

const app = {
    data: {
        products: [],
    },
    getData() {
        axios.get(`${url}api/${path}/admin/products`)
            .then((res) => {
                // console.log(res);
                if (res.data.success) {
                    this.data.products = res.data.products;
                    // console.log(this.data.products);
                    this.render();
                }
            })
    },
    render() {
        const productList = document.querySelector('#productList');
        let str = '';
        this.data.products.forEach((item) => {
            str = str + `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.origin_price}</td>
                    <td>${item.price}</td>
                    <td>${item.is_enabled? '已啟用': '尚未啟用'}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm" data-id="${item.id}" id="deleteBtn">
                            刪除
                        </button>
                    </td>
                </tr>`;
        })
        productList.innerHTML = str;

        const deleteBtns = document.querySelectorAll('#deleteBtn');
        deleteBtns.forEach((item) => {
            item.addEventListener('click', this.deleteProduct);
        })
    },
    deleteProduct(e) {
        // console.log(e.target.dataset.id);
        const id = e.target.dataset.id;

        axios.delete(`${url}api/${path}/admin/product/${id}`)
            .then((res) => {
                // console.log(res);
                app.getData();
            })
    },
    init() {
        // 出取 cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        // console.log(token);
        
        this.getData();
    }
}
// app.init();