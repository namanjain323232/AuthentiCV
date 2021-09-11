const passvalueResume = async (data) => {
  try {
    const result = await axios({
      method: "POST",
      url: "https://pdf2txt.herokuapp.com/pdf2txt/",
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


