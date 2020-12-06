// const scrapedin = require('scrapedin')

// const options = {
//     email: 'sedummy1@gmail.com',
//     password: 'sedummy!123'
// }

// scrapedin(options)
// .then((profileScraper) => profileScraper('https://www.linkedin.com/in/yash-kumar-665208154/'))
// .then((profile) => console.log(profile))

// import { LinkedInProfileScraper } from 'linkedin-profile-scraper';

const { LinkedInProfileScraper } = require('linkedin-profile-scraper')

guff = async() => {
  const scraper = new LinkedInProfileScraper({
    sessionCookieValue: 'AQEDATM0sxUFVxSiAAABdeDL5_oAAAF2BNhr-k4AG_EroMvAr1689Gl7iM0wMA5Qa-iFGK8LS1iVT7niCYYY0q6k1Y-idfndtmzwg7uWOqmREBfg8jgeaxvSFQ6qoviovVmAKB43d0rUTIJTcOlmpkfZ',
    keepAlive: true
  });

 // Prepare the scraper
  // Loading it in memory
  await scraper.setup()

  const result = await scraper.run('https://www.linkedin.com/in/yash-kumar-665208154/')
  
  console.log(result)
}

guff()
