import { defineStore } from "pinia";

export const useLoadingStore= defineStore('loading', {
    state: () => ({ 
        products: [],
        loading: true
     }),
    getters: {
      double: state => state.count * 2,
    },
    actions: {
        async fetchProducts() {
            try {
              // Giả lập việc tải dữ liệu
              // Thực tế, bạn sẽ thực hiện yêu cầu HTTP để lấy dữ liệu từ API hoặc nguồn khác
              await new Promise(resolve => setTimeout(resolve, 2000)); // Giả lập thời gian tải 2 giây
      
              this.loading = false;
              this.products = [
                { id: 1, name: 'Product 1', price: 10 },
                { id: 2, name: 'Product 2', price: 20 },
                // ...
              ];
            } catch (error) {
              console.error('Error fetching products:', error);
              this.loading = false;
            }
        
      }
    },
  })