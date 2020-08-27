export default {
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li 
        class="page-item"
        :class="{'disabled': pages.current_page === 1}"
      >
        <a 
          class="page-link" 
          href="#"
          @click.prevent="updatePage(pages.current_page - 1)"
        >Previous
        </a>
      </li>
      <li 
        class="page-item" 
        v-for="i in pages.total_pages" 
        :key="i" 
        :class="{ active: pages.current_page === i }"
      >
          <a 
            class="page-link" 
            href="#" 
            @click.prevent="updatePage(i)"
          >{{ i }}
          </a>
      </li>
      <li 
        class="page-item" 
        :class="{'disabled': pages.current_page === pages.total_pages}"
      >
          <a 
            class="page-link" 
            href="#" 
            @click.prevent="updatePage(pages.current_page + 1)"
            >Next
          </a>
      </li>
    </ul>
  </nav>`,
  // 如果是使用 <a></a> 產生觸發事件，建議加上 prevent -> 避免預設事件干擾觸發，清除預設事件
  // :key="i" :class="{ active: pages.current_page === i -> 調整當前頁碼 css 樣式，當前頁碼產生 active 效果
  // 把外面的資料傳入
  props: ['pages'],
  // 切換頁
  methods: {
    updatePage(num) {
      // 要知道點的是哪個，所以上面要帶上 -> updatePage(i) ，這裡用 num 接收
      // console.log(num);
      this.$emit('update', num);
    },
  },
};
