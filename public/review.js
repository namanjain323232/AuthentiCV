const passvalueReview = async (review) => {
   const stu = window.location.href.split('/')[5];
   const adm = window.location.href.split('/')[7];
   console.log(stu);
   console.log(adm);

   try {
     const result = await axios({
       method: "POST",
       url: "/api/v1/review",
       data: {
         review,
         reviewId: adm,
         sId: stu
       },
     });
     if (result.data.status === "success") {
       alert("Successful");
       window.setTimeout(() => {
         location.assign(`/adminControl/${adm}`);
       }, 800);
     }
   } catch (err) {
      console.log(err);
     alert("Unsuccessful");
   }
 };
 
 document.getElementById("reviewForm").addEventListener("submit", (e) => {
   e.preventDefault();
   const review = document.getElementById("review").value;
   passvalueReview(review);
 });
 