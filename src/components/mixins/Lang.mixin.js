export default {
  methods: {
    getFlagClass: locale =>
      `flag-icon flag-icon-${locale === "en" ? "gb" : locale}`
  }
};
