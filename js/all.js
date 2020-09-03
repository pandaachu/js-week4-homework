// pagination
// 把元件匯入
import pagination from './pagination.js';
// 可以作為全域或區域元件使用

// modal
import productModal from './productModal.js';
import delProductModal from './delProductModal.js';

Vue.component('pagination', pagination)
Vue.component('productModal', productModal)
Vue.component('delProductModal', delProductModal)

var app = new Vue({
  el: '#app',
  data: {
    temProduct: {
      imageUrl: [], // 資料結構
    }, //用來存寫進來的 products 物件
    pagination: {}, // 存放頁碼
    products: [],
    api: {
      uuid: '289038e7-cea7-4a49-afd4-86ec766c3f7f',
      apiPath: 'https://course-ec-api.hexschool.io/api/',
    },
    token: '',
    // openModal 的變數
    isNew: false,
    loadingBtn: '',
  },
  methods: {
    openModal(isNew, item) {
      // 觸發時帶入參數
      switch (
        isNew // 判斷 modal 一個一個打開
      ) {
        case 'new': // 判斷時看參數
          this.temProduct = { imageUrl: [] };
          this.isNew = true;
          $('#productModal').modal('show');
          break;
        case 'edit':
          this.loadingBtn = item.id;
          // 列表的資料有缺 description，所以要重新取得單一產品資料
          const url = `${this.api.apiPath}${this.api.uuid}/admin/ec/product/${ item.id }`
          // console.log(item);
          axios.get(url)
          .then(res=>{
            // console.log(res);
            this.temProduct = res.data.data
            $('#productModal').modal('show');
            this.loadingBtn = ''; // 清除
          })
          this.isNew = false;
          // 打開 modal 先 copy 這個產品資料到 temProduct
          // 淺拷貝 -> Object.assign({}, 要插入的值)
          //this.temProduct = Object.assign({}, item); // item = edit 傳來的資料
          break;
        case 'delete':
          this.temProduct = Object.assign({}, item); // 抓到要刪除的產品名稱顯示在 modal
          $('#delProductModal').modal('show');
          break;
        default:
          break;
      }
    },
    getProducts(num = 1){ // 帶上分頁的參數 -> 第一種寫法
      // 防止 'url: "https://course-ec-api.hexschool.io/api/289038e7-cea7-4a49-afd4-86ec766c3f7f/admin/ec/products?page=undefined" ' --> 出現 undefined
      // 第二種寫法：
      // 如果 num 不存在，num = 1：
      // if (!num) { num = 1 };

      // console.log(num);
      // console.log(1);
      // API
      // 為什麼不能寫 apiPath & uuid  -> 這兩個變數在 app{} 物件裡
      // const api = `${this.api.apiPath}${this.api.uuid}/admin/ec/products`;
      // 帶上分頁：
      const api = `${this.api.apiPath}${this.api.uuid}/admin/ec/products?page=${ num }`;
      axios.get(api)
        .then(res=>{
          // console.log(res);
          // 對應遠端傳回來的資料
          this.products = res.data.data;
          this.pagination = res.data.meta.pagination;
          // 如果 id 存在
          if (this.temProduct.id){
            this.temProduct = {
              imageUrl: [], // 資料結構
            }; // 把 temProduct 清除，避免重覆觸發
            $('#productModal').modal('hide');
          }
        })
    }
  },
  created() {
    // 1. 把 token 帶出來
    // 取得 token 的 cookies
    // 寫在這裡而不寫在 methods 的好處是其他地方會自動帶上這個 token
    this.token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
    );
    // 2. 把 token 作為預設值拿來發送
    // 將 Token 加入到 Headers 內
    // 要加上 Bearer
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

    // 如果無法取得 token 會返回 login 裡畫面
    // 防止直接輸入網址進入畫面
    if (this.token===""){
      window.location = "/js-week4-homework/login.html"
    }

    // 執行 getProducts()
    this.getProducts()
  }
});