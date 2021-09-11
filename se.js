
const { LinkedInProfileScraper } = require('@viliv/linkedin-profile-scraper')

guff = async () => {
  const scraper = new LinkedInProfileScraper({
    sessionCookieValue: 'AQEDATM5Ha0Ac3q4AAABe8_22-EAAAF79ANf4VYAZW1gInlgNDyjAPORliyIjxNgBcocZrlNaMu_4yWjq0y-KXW4ouJLeO3fmck8IvynfQg5ZgcftyPLlKXHwtMsOmRLOlSYcj_-9vzvc7VvQ1-czhoy',
    keepAlive: false
  });

  // Prepare the scraper
  // Loading it in memory
  await scraper.setup()

  const result = await scraper.run('https://www.linkedin.com/in/dpmittal/')

  console.log(result)
}

guff()
