export default {
  template: `<div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="exampleModalLabel" class="modal-title">
            <span>新增產品</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
            <!-- 因為已經在編輯按鈕上綁定按下按鈕打開該產品資料 modal，且把資料存在 temProduct，所以這裡的 v-model 是綁 temProduct.imageUrl, 而不是 product.imageUrl -->
            <div v-for="i in 5" :key="i + 'img'" class="form-group">
            <label :for="'img' + i">輸入圖片網址</label>
            <input :id="'img' + i" v-model="temProduct.imageUrl[i - 1]" type="text" class="form-control"
            placeholder="請輸入圖片連結">
            </div>
            <div class="form-group">
            <!-- 這個方法能適合在新增產吅的時候用 -->
                <label for="customFile">
                  或 上傳圖片
                  <i v-if="status.fileUploading" class="fas fa-spinner fa-spin"></i>
                </label>
                <input id="customFile" ref="file" type="file" class="form-control" @change="uploadFile">
              </div>
              <img :src="temProduct.imageUrl[0]" class="img-fluid" alt />
            </div>
            <div class="col-sm-8">
              <div class="form-group">
                <label for="title">標題</label>
                <input
                  v-model="temProduct.title"
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                />
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="category">分類</label>
                  <input
                    v-model="temProduct.category"
                    id="category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label for="unit" >單位</label>
                  <input
                    v-model="temProduct.unit"
                    id="unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                  <input
                    v-model="temProduct.origin_price"
                    id="origin_price"
                    type="number"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label for="price">售價</label>
                  <input
                    v-model="temProduct.price"
                    id="price"
                    type="number"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />

              <div class="form-group">
                <label for="content">產品描述</label>
                <textarea
                  v-model="temProduct.content"
                  id="content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="description">說明內容</label>
                <textarea
                  v-model="temProduct.description"
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                ></textarea>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input
                    id="enabled"
                    class="form-check-input"
                    type="checkbox"
                    v-model="temProduct.enabled"
                  />
                  <label class="form-check-label" for="enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
            取消
          </button>
          <button @click="updateProduct" type="button" class="btn btn-primary">
            確認
          </button>
        </div>
      </div>
    </div>`,
  data() {
    return {
      imageUrl: [],
      filePath: '',
    };
  },
  // 要把外層的 api 傳進來
  props: ['isNew','temProduct','api','status'],
  methods: {
    // 上傳產品資料
    updateProduct() {
      // 新增商品
      // this.isNew = true; 要符合此條件
      let api = `${this.api.apiPath}${this.api.uuid}/admin/ec/product`;
      let axiosMethod = 'post';
      // 如果不是新增產品 -> 編輯產品
      if (!this.isNew) {
        api = `${this.api.apiPath}${this.api.uuid}/admin/ec/product/${ this.temProduct.id }`;
        axiosMethod = 'patch';
      }
      axios[axiosMethod](api, this.temProduct).then(() => {
        $('#productModal').modal('hide');
        this.$emit('update');
      }).catch((error) => {
        console.log(error)
      });
    },
    uploadFile() {

      // 選取 DOM 中的檔案資訊
      // 取得 DOM 物件
      const uploadedfile = document.querySelector('#customFile').files[0]
      // const uploadedfile = this.$refs.file.files[0];
      // files 屬性
      console.dir(uploadedfile)

      // 轉成 Form Data ( 固定寫法 )
      const formData = new FormData();
      formData.append('file', uploadedfile); // 加新的欄位 -> 對應 API

      // 路由、驗證
      const url = `${this.api.apiPath}${this.api.uuid}/admin/storage`;

      // 利用狀態碼製作上傳東西時顯示 loading 圖示的做法，之後可應用在各頁面之讀取
      this.status.fileUploading = true; 

      // 透過 Ajax 上傳
      axios.post(url, formData, {
        headers: { // 聲明這段內容要傳送的時候必需使用 formData 格式
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response);
        // 接到參數後關閉 loading 圖示
        this.status.fileUploading = false;
        // 把路徑帶到畫面
        if (response.status === 200) {
          this.temProduct.imageUrl.push(response.data.data.path);
        }
        // 圖片上傳有大小限制，過度使用會被停權
      })
      .catch(() => {
        console.log('上傳不可超過 2 MB');
        this.status.fileUploading = false;
      });
    },


    // // 按下 updateProduct() 會更新 temProduct 資料
    // updateProduct() {
    //   let url = `${this.api.apiPath}${this.api.uuid}/admin/ec/product/${ this.temProduct.id }`
    //   axios.patch(url, this.temProduct)
    //   .then(res=>{
    //     // console.log(res);
    //     // 跟外層說把事情做完了，麻煩更新畫面
    //     this.$emit('update')
    //     })
    //   // temProduct 是物件，有傳參考的特性，這裡沒有改到原本的值，所以：
    //   // 跟這個："單向數據流 - 使用 Props 接收資料都不能作修改" 不衝突
    // },
  },
};
