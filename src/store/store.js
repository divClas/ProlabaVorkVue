import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    data: null,
    selectedItems: {},
    htmlPreview: "",
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    addSelectedItem(state, item) {
      state.selectedItems = { ...state.selectedItems, ...item }; // Update the object
      console.log(state.selectedItems);
    },
    setHTMLPreview(state, html) {
      state.htmlPreview = html;
    },
    removeSelectedItem(state, itemId) {
      delete state.selectedItems[itemId]; // Remove the item from the object
    },
    clearSelectedItems(state) {
      state.selectedItems = {}; // Clear the object
    },
  },
  actions: {
    async fetchData({ commit }) {
      try {
        const response = await axios.get(
          "https://devserv.rsexpertiza.ru/api/document-constructor"
        );
        commit("setData", response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async uploadFile({ commit }, files) {
      try {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });

        const response = await axios.post(
          "https://devserv.rsexpertiza.ru/api/document-constructor/files-info",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        commit("addSelectedItem", {
          HASH_TYPE: "MD5",
          files: [
            {
              FILE_HASH: response.data.data.files.hash.MD5,
              FILE_NAME: response.data.data.files.name,
              FILE_SIZE: response.data.data.files.size,
            },
          ],
          roles: [
            {
              ROLE_DATE: "",
              ACTION: "",
              SECOND_NAME: "",
            },
          ],
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
    async getHTMLDOC({ commit, state }) {
      try {
        // const formattedData = {
        //   DOCUMENT_TYPE_ID: state.selectedItems.DOCUMENT_TYPE_ID || 1,
        //   DOCUMENT_NAME: state.selectedItems.DOCUMENT_NAME || "",
        //   OBJECT_NAME: state.selectedItems.OBJECT_NAME || "",
        //   HASH_TYPE: state.selectedItems.HASH_TYPE || "MD5",
        //   files: state.selectedItems.files?.map(file => ({
        //     FILE_NAME: file.FILE_NAME || "",
        //     DOCUMENT_DATE: file.DOCUMENT_DATE || "",
        //     FILE_SIZE: file.FILE_SIZE || "",
        //     FILE_HASH: file.FILE_HASH || ""
        //   })) || [],
        //   roles: state.selectedItems.roles?.map(role => ({
        //     ROLE_DATE: role.ROLE_DATE || "",
        //     ACTION: role.ACTION || "",
        //     SECOND_NAME: role.SECOND_NAME || ""
        //   })) || []
        // };
        const response = await axios.post(
          "https://devserv.rsexpertiza.ru/api/document-constructor/generate/preview",
          JSON.stringify(state.selectedItems)
        );
      } catch (error) {
        console.error("Error generating HTML preview:", error);
      }
    },
  },
  getters: {
    getData: (state) => state.data,
    getSelectedItems: (state) => state.selectedItems,
  },
});
