const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    "194779671929-af10egvq7vfo9tvphfj8b2hq7r25tr46.apps.googleusercontent.com",
    "255E6WjK8zqi0fgLcm_Y__Ef",
    "https://localhost:3000"
);

const scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtubepartner'
];

const express = require('express'); // express 모듈 추가하기
var fs = require('fs');
var https = require('https');
var url = require('url');
var open = require('open');

const app = express();
const path = require('path');
const options = {
    key: fs.readFileSync('./keys/private.pem'),
    cert: fs.readFileSync('./keys/public.pem')
};

async function authenticate(){
    return new Promise((resolve, reject) => {

        const authorizeUrl = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
            // If you only need one scope you can pass it as a string
            scope: scopes
        });

        const server = https.createServer(async(req, res) => {
            try{
                if(req.url.indexOf('/api/oauth2callback') > -1 ){
                    const qs = new url.URL(req.url, 'https://localhost:3000').searchParams;
                    server.destroy();

                    const {
                        tokens
                    } = await oauth2Client.getToken(qs.get('code'));

                    resolve(qs.get('code'));
                }
            } catch(e) {
                console.log(e);
                reject(e);
            }
        }).listen(3031, () => {
            //os 기본 브라우저를 실행시켜서 인자값(authroizeUrl)을 호출
            open(authorizeUrl, {
                wait : false
            }).then(cp => cp.unref());
        });
    })
}

// async function runSample(code){
//     // console.log("hi");
//     console.log(code);
// }

async function runSample(client){
    console.log('진행 중..1');
    var service = google.youtube('v3');
    console.log('진행 중..2');
    service.videos.list({
        auth: client,
        part : 'snippet,statistics',
        fields : 'items(snippet(title, description, channelId), statistics(viewCount, likeCount, commentCount))',
        myRating: 'like'
    }, function(err, response){
        if(err){
            console.log('The API returned an error : ' + err);
            return;
        }
        console.log('진행 중..');
        var video = response.data.items;
        if(video.length==0){
            console.log('검색된 동영상이 없습니다.');
        }else{
            console.log('동영상이 검색 되었습니다.');
            console.log(JSON.stringify(response.data.items[0], null, 4));
        }
    });
}

async function runSample_false(){
    console.log('failed');
}

// authenticate()
//     .then(runSample())
//     .catch(console.error);

authenticate()
    .then(client => runSample(client))
    .catch(console.error);

// console.log(url);
//https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl%20https%3A%2F%2Fwww.google
// apis.com%2Fauth%2Fyoutube.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutubepartner&response_type=code&client_id=194779671929-af10egvq7vfo9tvphfj8b2hq7r25tr46.apps.googleusercontent.com&redirect_uri=
// https%3A%2F%2Flocalhost%3A3000
//https://localhost:3000/?code=4/zwGnKXm1FhXSPl9INqxExoH92brT34qZOT-uCJKSwvefOdkyR3i6XKOkK5QbbtsqzzJXJUvRoFo99YhpLqsJN4E&scope=https://www.googleapis.com/auth/youtube.force-ssl%20https://www.googleapis.com/auth/youtube.readonly%20https://www.googleapis.com/auth/youtubepartner%20https://www.googleapis.com/auth/youtube
//https://localhost:3000/?code=4/zwG6BXNw41XCBKreL5buZxArsmXha2pESb4ynEH-uSutpCNFG4VB7QdB-N4nZd05vdpqyThmteUAcP8TQs147xw&scope=https://www.googleapis.com/auth/youtube.force-ssl%20https://www.googleapis.com/auth/youtube.readonly%20https://www.googleapis.com/auth/youtube%20https://www.googleapis.com/auth/youtubepartner
