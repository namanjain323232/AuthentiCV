const passvalueResume = async (data) => {
   try {
     const result = await axios({
       method: "POST",
       url: "http://54.226.11.201:8080/pdf2txt/",
      //  headers:{
      //    'Access-Control-Allow-Origin': '*',
      //    // 'Access-Control-Allow-Origin':  http://127.0.0.1:3000
      //    'Access-Control-Allow-Methods': 'POST',
      //    'Access-Control-Allow-Headers': 'Content-Type, application/json'
      //  },
       data
     });
     if (result.data !== null) {
      console.log(result);
      passvalueChecker(result.data);
      // alert("Successful");
     }
   } catch (err) {
     console.log(err);
     alert("Unsuccessful");
   }
 };

 const passvalueChecker = async (checker) => {
  try {
    const result = await axios({
      method: "PATCH",
      url: "/api/v1/checker",
      data: {
        authentic: checker
      }
  });
    if (result.data !== null) {
      alert("Successful");
      window.setTimeout(() => {
        location.assign("/");
      }, 800);
    }
  } catch (err) {
    console.log(err);
    alert("Unsuccessful");
  }
};
 
 
 