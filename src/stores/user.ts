// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
  }),
  actions: {
    updateName(name: string) {
      this.name = name;
    },
    updateEmail(email: string) {
      this.email = email;
    },
  },
});