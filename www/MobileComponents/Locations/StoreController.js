function StoreController($scope, $stateParams) {
    // Init
    $scope.Stores = {
        '333-east-17th-street': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"333 East 17th St",
            storeHours:["Monday-Friday: 6:30am – 8:00pm","Saturday: 8:00am – 6:00pm", "Sunday: 10:00am – 5:00pm"],
            storePhone:"19496465110",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=333+E+17th+St,+Costa+Mesa,+CA+92627"
        },
        '675-paularino-ave': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"675 Paularino Ave",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 4:00pm", "Sunday: Closed"],
            storePhone:"17147513115",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=675+Paularino+Ave,+Costa+Mesa,+CA+92626/"
        },
        '821-w-taft-ave': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"821 W Taft Ave",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 4:00pm", "Sunday: Closed"],
            storePhone:"17145241994",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=821+W+Taft+Ave,+Orange,+CA+92865"
        },
        '1813-e-orangethorpe-ave': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"1810 E Orangethorpe Ave",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 5:00pm", "Sunday: Closed"],
            storePhone:"17149611618",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=1810+E+Orangethorpe+Ave,+Fullerton,+CA+92831"
        },
        '1069-e-imperial-hwy': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"1069 E Imperial Hwy",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 4:00pm", "Sunday: Closed"],
            storePhone:"17149615385",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=1069+E+Imperial+Hwy,+Placentia,+CA+92870"
        },
        '3415-via-lido': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"3415 Via Lido",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 4:00pm", "Sunday: Closed"],
            storePhone:"19496733394",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=3415+Via+Lido,+Newport+Beach,+CA+92663"
        },
        '36330-e-santa-ana-canyon-rd': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"6330 E Santa Ana Canyon Rd",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 5:00pm", "Sunday: Closed"],
            storePhone:"",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=6330+E+Santa+Ana+Canyon+Rd,+Anaheim,+CA+92807"
        },
        '20982-brookhurst-st': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"20982 Brookhurst St",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 4:00pm", "Sunday: Closed"],
            storePhone:"17149659152",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=20982+Brookhurst+St,+Huntington+Beach,+CA+92646"
        },
        '19754-yorba-linda-blvd': {
            storeImage:"Content/images/KONA-Family-LOGO.jpg",
            storeTitle:"19754 Yorba Linda Blvd",
            storeHours:["Monday-Friday: 7:00am – 7:00pm", "Saturday: 8:00am – 4:00pm", "Sunday: Closed"],
            storePhone:"17149708441",
            storeEmail:"aloha@konacleaners.com",
            storeMapLink:"https://maps.google.com/?q=19754+Yorba+Linda+Blvd,+Yorba+Linda,+CA+92886"
        }
    };
    $scope.selected = $scope.Stores[$stateParams.key];
};