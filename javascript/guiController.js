var aboutShown = false;
var menuShown = false;
var aboutAnimating = false;

var selectedAgencies = [];
var selectedRegions = [];

var statSlideIndex = 0;
var statSlideMaxIndex = 1;

function clearPopUp(animationComplete) {
    aboutPage = document.getElementById('aboutContent');
    
    aboutAnimating = true;
    if(aboutPage) {
        aboutPage.style.animationName = 'aboutOut';
        aboutPage.style.webkitAnimationName = 'aboutOut';
        aboutPage.style.animationDuration = '1.5s';
        aboutPage.style.webkitAnimationDuration = '1.5s';

        aboutPage.addEventListener('webkitAnimationEnd', function() {
            aboutPage = document.getElementById('aboutContent');
            aboutPage.parentElement.removeChild(aboutPage);
            aboutAnimating = false;
            aboutShown = false;
            animationComplete();
        });

        aboutPage.addEventListener('animationend', function() {
            aboutPage = document.getElementById('aboutContent');
            aboutPage.parentElement.removeChild(aboutPage); 
            aboutAnimating = false;
            aboutShown = false;
            animationComplete();
        });
    }
    else {
        aboutAnimating = false;
        aboutShown = false;
        animationComplete();
    }
}

function showPopUp(content, animationComplete) {
    overlay = document.getElementById('overlay');
    overlay.innerHTML += content;
    aboutPage = document.getElementById('aboutContent');
    aboutPage.addEventListener('webkitAnimationEnd', function() {
        aboutAnimating = false;
        aboutShown = true;
        animationComplete();
    });
    aboutPage.addEventListener('animationend', function() {
        aboutAnimating = false;
        aboutShown = true;
        animationComplete();
    });
}

function togglePopUp() {
    if(!aboutAnimating) {
        aboutAnimating = true;
        if(!aboutShown) {
            showPopUp(content,function() {});
        }
    }
}

function toggleAboutMenu() {
    clearPopUp(function(){
        content = '<div id="aboutContent">' +
        '<button class="aboutExitButton" onclick="clearPopUp(function(){})">X</button>' +
        '<h3>About</h3>' +
        '<p>City Watch is an application that plots all the 911 calls made in Monroe County. When generating the heatmap the population density is considered. You can filter the results by clicking the menu button in the right corner.</p>' +
        '<h3>Developers</h3>' +
        '<p>Eric Lee</p>' +
        '<p>Liam Middlebrook</p>' +
        '<h3>Credits</h3>' +
        '<p>Menu by David Vickhoff from The Noun Project</p>' + 
        '<p>Castle by Chris Luders from The Noun Project</p>' +
        '<p>Information by John Chapman from The Noun Project</p>' +
        '<p>Statistics by Convoy from The Noun Project</p>' +
        '</div>';
        togglePopUp(content);
    });
}

function toggleStatMenu() {
    clearPopUp(function() {
        content = '<div id="aboutContent">' +
            '<button class="aboutDirectionButton" onclick="statReverseClicked()">&#60;</button>' +
            '<button class="aboutDirectionButton" style="left: 60px;" onclick="statForwardClicked()">&#62;</button>' +
            '<button class="aboutExitButton" onclick="clearPopUp(function(){})">X</button>' +
            '<h3>Stats</h3>' +
            getStatContent(statSlideIndex) +
            '</div>';
        togglePopUp(content);
    });
}

function fadeOut(el) {
    el.style.transition = 'opacity 1.5s ease';
    el.style.webkitTransition = 'opacity 1.5s ease';
    var fadeOutObject = el;
    var fadOutComplete = function(event) {
        fadeOutObject.style.display = 'none';
    }
    el.addEventListener('webkitTransitionEnd', fadOutComplete, false);
    el.addEventListener('transitionend', fadOutComplete, false);
    el.addEventListener('oTransitionEnd', fadOutComplete, false);
    el.style.opacity = '0';
}

function toggleMenu() {
    menuBox = document.getElementById('menuBox');
    contentPane = document.getElementById('content');
    if(!menuShown)
        contentPane.style.right = menuBox.offsetWidth + 'px';
    else
        contentPane.style.right = '0px'
    
    if(window.location.hash != '#markers')
        spinMenuImage();
        
    menuShown = !menuShown; 
}

function addSlideWithContent(content) {
    statSlide = document.getElementById('statSlide');
    parent = statSlide.parentElement;
    parent.removeChild(statSlide);
    
    parent.innerHTML += content;
}

function statReverseClicked() {
    console.log(statSlideIndex);
    if(statSlideIndex > 0) {
        statSlideIndex--;
        content = getStatContent(statSlideIndex);
        addSlideWithContent(content); 
    }
}

function statForwardClicked() {
    console.log(statSlideIndex);
    if(statSlideIndex < statSlideMaxIndex) {
        statSlideIndex++;   
        content = getStatContent(statSlideIndex);
        addSlideWithContent(content);
    }
}

function checkBoxClicked(el) {
    agency = el.name;
    selectedAgencies[agency] = el.checked;
    
    label = document.getElementById(agency + 'CheckboxLabel');
    if(!el.checked)
        label.style.borderColor = '#ddd';
    else
        label.style.borderColor = getColorForAgency(agency);
}

function regionCheckboxClicked(el) {
    region = el.name;
    selectedRegions[region] = el.checked;
}

function applyMenuButtonClicked() {
    data = getFilteredData();
    refreshMapForHash(data);
}

function spinMenuImage() {
    menuImage = document.getElementById('headerMenuButton');
    
    if(!menuShown) {
        menuImage.style.animationName = 'counterSpin';
        menuImage.style.webkitAnimationName = 'counterSpin';
    }
    else {
        menuImage.style.animationName = 'clockSpin';
        menuImage.style.webkitAnimationName = 'clockSpin';
    }
    menuImage.style.webkitAnimationDuration = '.5s';
    menuImage.style.animationDuration = '.5s';
    
    menuImage.addEventListener('webkitAnimationEnd', function() {
       menuImage = document.getElementById('headerMenuButton');
       menuImage.style.webkitAnimationName = ''; 
    });
    menuImage.addEventListener('animationEnd', function() {
        menuImage = document.getElementById('headerMenuButton');
        menuImage.style.animationName = '';   
    });
}

function menuAddItems(items) {
    menuBox = document.getElementById('menuBox');
    
    appendHTML = '<form style="margin: 25px;">';
    for(i = 0; i < items.length; i++) {
        appendHTML += buildMenuCheckBox(items[i]);
        selectedAgencies[items[i]] = true;
    }
    appendHTML += '</form>';
    menuBox.innerHTML += appendHTML;
}

function menuAddRegionItems(items) {
    menuBox = document.getElementById('menuBox');
    
    appendHTML = '<div style="margin:25px;">' +
        '<h3 style="margin:0px;">Regions</h3>' +
        '<hr />';
    for(i = 0; i < items.length; i++) {
        if(items[i] != '') {
            appendHTML += buildRegionMenuCheckBox(items[i]);
            selectedRegions[items[i]] = true;
        }
    }
    menuBox.innerHTML += appendHTML;
}   

function buildRegionMenuCheckBox(title) {
    return '<div class="menuCheckbox">' + 
        '<input type="checkbox" checked="checked" id="' + title + 'checkbox" value="1" name="' + title + '" onClick="regionCheckboxClicked(this)"/>' +
        '<label id="' + title + 'CheckboxLabel" for="' + title + 'checkbox"></label>' + 
        '<p>' + title + '</p>' +
        '</div>';
}
    
function buildMenuCheckBox(title) {
    return '<div class="menuCheckbox">' + 
        '<input type="checkbox" checked="checked" id="' + title + 'checkbox" value="1" name="' + title + '" onClick="checkBoxClicked(this)"/>' +
        '<label id="' + title + 'CheckboxLabel" style="border-color: ' + getColorForAgency(title) + '" for="' + title + 'checkbox"></label>' + 
        '<p>' + title + '</p>' +
        '</div>';
}

function getColorForAgency(agency) {
    switch(agency) {
        case 'Police':
            return '#0062E3';
        case 'Fire':
            return '#e83600';
        case 'Ambulance':
            return 'green';
        case 'Trafic':
            return '#facb04';
        default:
            return 'black';
    }
}

function getStatContent(index) {
    content = '';
    filteredData = getFilteredData();
    if(index == 0) {
        agencyMetrics = calcAgencyPercent(filteredData);
        content = '<div id="statSlide" style="width:100%">' + 
                '<table>' +
                '<tr>' +
                '<th>Agency</th>' +
                '<th>Percentage</th>' +
                '</tr>';
            for(key in agencyMetrics) {
                metric = Math.round(agencyMetrics[key] * 10000) / 100;
                content += '<tr>' + 
                    '<td class="tableLabel"><span style="color: ' + getColorForAgency(key) + '">' + key + ':</span></td>' + 
                    '<td class="tableValue">' + metric + '%</td>' +
                    '</tr>';  
            }

            content += '</table></div>';
    }
    
    else if(index == 1) {
        zipMetrics = calcZipPercent(filteredData);
        content += '<div id="statSlide" style="width: 100%">' +
            '<table>' +
            '<tr>' +
            '<th>ZIP Code</th>'+
            '<th>Percentage</th>' +
            '</tr>';
        for(key in zipMetrics) {
            metric = Math.round(zipMetrics[key] * 10000) / 10000;
            content += '<tr>' +
                '<td class="tableLabel">' + key + '</td>' +
                '<td class="tableValue">' + metric + '</td>' +
                '</tr>';
        }
        
        content += '</table></div>';
    }
    return content;
}