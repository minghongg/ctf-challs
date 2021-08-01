db = db.getSiblingDB('flowerium');

db.users.insert({
    name : 'minghong', 
    email : 'minghong2403@gmail.com', 
    password : '$2b$12$40Ac1gCskdAqwdOhfF3Hg.qPRr.NdLS4D2xmtTOHWw8z7JLWAz37i', 
    isVip : false, 
    balance : 100, 
    cart : {
        items : [] 
    } 
});

db.products.insertMany([
    {
        title : "Agapanthus",
        price : 50,
        isVip : false
    },
    {
        title : "Purple Alstroemerias",
        price : 50,
        isVip : false
    },
    {
        title : "Orange Alstroemerias",
        price : 110,
        isVip : false
    },
    {
        title : "Black Roses",
        price : 100,
        isVip : false
    },
    {
        title : "Corsages",
        price : 120,
        isVip : false
    },
    {
        title : "Aralia",
        price : 200,
        isVip : true
    },
    {
        title : "CSCCTF{h3Re_T4kE_uUR_b0uUN7y_GGWP!}",
        price : 1337,
        isVip: true
    }
]);