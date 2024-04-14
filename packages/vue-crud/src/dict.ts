import { ref } from "vue";

export function dict(option: DictOption): DictInstance {
  return {
    reload() {
      if (option.getData) {
        option.getData().then((data) => (this.data.value = wrapData(data)));
      } else if (option.data) {
        this.data.value = wrapData(option.data);
      } else {
        this.data.value.length = 0;
      }

      function wrapData(data: any[]) {
        if (option.label || option.value)
          return data.map((item) => ({
            label: item[option.label || "label"],
            value: item[option.value || "value"],
          }));
        return data;
      }
    },
    data: ref([]),
  };
}
