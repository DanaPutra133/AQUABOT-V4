const axios = require('axios');

const fetchData = async () => {
    try {
        const response = await axios.get('https://casa.aquafxca.my.id/api/get?apikey=dana');
        console.log(response.data); // Log the JSON result
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

setInterval(fetchData, 60000); // 60000 milliseconds = 1 minute

// Initial call to fetch data immediately
fetchData();
