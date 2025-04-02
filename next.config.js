// // next.config.js
// module.exports = {
//     basePath: '/robot-tool',
//   }
module.exports = {
    redirects() {
      return [
        {
          source: '/login',
          destination: '/',
          permanent: true, // Set to false for temporary redirect
        },
      ];
    },
  };
  