const url = './dashboard';

$('#getdetails').on('click', () => {
    console.log('Get details');
    axios.put(url)
        .then(response => {
            console.log(response.data);
            $('#details').html(JSON.stringify(response.data.details));
        })
        .catch(error => {
            console.error(error)
        })
})