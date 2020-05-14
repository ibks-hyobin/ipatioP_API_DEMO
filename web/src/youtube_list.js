var {google} = require('googleapis');

async function runSample(client){
    var service = google.youtube('v3');
    service.videos.list({
        auth: client,
        part : 'snippet,statistics',
        myRating: 'like'
    }, function(err, response){
        if(err){
            console.log('The API returned an error : ' + err);
            return;
        }

        var video = response.data.items;
        if(video.length==0){
            console.log('검색된 동영상이 없습니다.');
        }else{
            console.log(JSON.stringify(response.data.items[0], null, 4));
        }
    });
}

authenticate().then(client => runSample(client)).catch(console.error);
