const passvalueLogout = async () => {
   try {
     const result = await axios({
       method: "GET",
       url: "/api/v1/logout",
     });
     if (result.data.status === "success") {
      alert("Successful");
      window.setTimeout(() => {
         location.assign("/");
      }, 200);
     }
   } catch (err) {
     console.log(err);
     alert("Unsuccessful");
   }
 };
 
 document.getElementById("logoutButton").addEventListener("click", (e) => {
   e.preventDefault();
   passvalueLogout();
 });
 