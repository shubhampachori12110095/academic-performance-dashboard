function hidePreloader() {
    $('#loader-wrapper').fadeOut('slow');
}

function academic_performance_dashboard(myData) {
    allStudSections(myData);
    allStudGrade(myData);
    allSpeci(myData);

    // set stage
  stage = anychart.graphics.create("stud-container");

  var getBarLegend = function (items) {
    var legend = anychart.standalones.legend();
    legend.fontSize('12px')
            .fontFamily("'Verdana', Helvetica, Arial, sans-serif")
            .itemsLayout('horizontal-expandable')
            .fontColor("#999")
            .padding(0)
            .margin(5,0,0,0)
            .iconTextSpacing(3)
            .align('left')
            .itemsSpacing(3)
            .items(items)
            .iconSize(12);
    return legend
};

  var eachBarLegend = getBarLegend([
        {
            'index': 0,
            'text': 'listening',
            'iconType': "marker",
            'iconStroke': 'none',
            'iconFill': "#87CEFA"
        },
        {
            'index': 1,
            'text': 'reading',
            'iconType': "marker",
            'iconStroke': 'none',
            'iconFill': "#1976d2"
        },
        {
            'index': 2,
            'text': 'writing',
            'iconType': "marker",
            'iconStroke': 'none',
            'iconFill': "#FF8C00"
        },
        {
            'index': 3,
            'text': 'speaking',
            'iconType': "marker",
            'iconStroke': 'none',
            'iconFill': "#FFFF00"
        }
    ]);

    var getSpecLegend = function (items) {
      var legend = anychart.standalones.legend();
      legend.fontSize('12px')
              .fontFamily("'Verdana', Helvetica, Arial, sans-serif")
              .itemsLayout('horizontal-expandable')
              .fontColor("#999")
              .padding(0)
              .margin(5,0,0,0)
              .iconTextSpacing(3)
              .align('center')
              .itemsSpacing(3)
              .items(items)
              .iconSize(10);
      return legend
    }
    var specLegend = getSpecLegend([
    {
        'index': 0,
        'text': 'specialized subject',
        'iconType': "circle",
        'iconStroke': 'none',
        'iconFill': "#A65140"
    }
    ]);

  // Title settings
  var title = anychart.standalones.title();
  title.fontFamily("verdana, helvetica, arial, sans-serif").fontWeight("normal");
  title.text("<span style='color:#999; font-size: 24px;'>Academic performance</span> <span style='color: #999; font-size: 20px; font-weight: normal;'>(English course)</span>");
  title.orientation("top").align("left").vAlign("bottom").margin(10).padding(0).height(20).useHtml(true);
  title.container(stage).draw();

  // content for first row
  var contents = [[null,null,"Students", "Variance from target,", "%", "Final score", "Sections (0-5 scores)"],["",,specLegend,makeAxis(),"","",eachBarLegend]];

  // create table
  var table = anychart.standalones.table();

  table.top(title.getRemainingBounds().getTop());

  for(var i= 0; i<myData.length; i++){
    contents.push([
      i+1,
      specSubject(i),
      myData[i]['full_name'],
      newBullet(i),
      calculatePercentToTarget(i),
      myData[i]['accomplished'],
      eachStacked(i)
    ]);
  }

  // set table content
  table.contents(contents);

  table.cellBorder(null)
  table.getRow(0)
    .height(40)
    .fontColor("#111")
    .border()
    .bottom("2 #ccc");

  table.getCol(0).width(40);
  table.getCol(1).width(30);
  table.getCol(4).width(70);
  table.getCol(5).width(100);

  // visual settings for text in table
  table.vAlign("middle").hAlign("center").fontWeight('normal').fontSize(14);


  // set table container and initiate draw
  table.container(stage).draw();

  function eachStacked(i) {
    // create a data set
   var data = anychart.data.set([
     [myData[i]['full_name'], myData[i]['sections']['listening'], myData[i]['sections']['reading'],
     myData[i]['sections']['writing'],myData[i]['sections']['speaking']]
   ]);

   // map the data
   var seriesData_1 = data.mapAs({x: 0, value: 1});
   var seriesData_2 = data.mapAs({x: 0, value: 2});
   var seriesData_3 = data.mapAs({x: 0, value: 3});
   var seriesData_4 = data.mapAs({x: 0, value: 4});

   // create a chart
   eachBar = anychart.bar();

    var setupSeriesLabels = function (series, name) {
     series.name(name)

   };
   var series;

   // enable the percent stacking mode
   eachBar.yScale().stackMode("value");

   // create area series, set the data
   series = eachBar.bar(seriesData_1);
   setupSeriesLabels(series, 'listening');
   series = eachBar.bar(seriesData_2);
   setupSeriesLabels(series, 'reading');
   series = eachBar.bar(seriesData_3);
   setupSeriesLabels(series, 'writing');
   series = eachBar.bar(seriesData_4);
   setupSeriesLabels(series, 'speaking');

   // configure tooltips
   eachBar.bounds(0, 0, "100%", 40);
   eachBar.interactivity().hoverMode('by-x');
   eachBar.tooltip()
        .displayMode('union');

   eachBar.yScale().minimum(0).maximum(20);
   eachBar.animation(true);

   eachBar.yScale().stackMode('value');

   var interactivity = eachBar.interactivity();
  interactivity.selectionMode("none");

// set yAxis labels formatting, force it to add % to values
   // configure labels on the Y-axis
   eachBar.yAxis(false);
   eachBar.xAxis(false);

   return eachBar;
  }

  function specSubject (i) {

    if (myData[i]['specialized_subject']==true) {
      var specCircle = acgraph.circle(5, 5, 5);
      specCircle.fill("#a65140");
      specCircle.stroke(false);
    return specCircle;
    }
  }

  function newBullet (i) {

  bullet = anychart.bullet([
    {
        value: myData[i]['accomplished'],
        type: 'bar',
        fill: '#1976d2',
        gap: 0.75,
        stroke: null
    },
    {
        value: myData[i]['target'],
        type: 'line',
        gap: 0.3,
        stroke: {thickness: 2, color: '#555555'}
    }


  ]);
  // Set chart ranges
   bullet.range().from(0).to(50);
   bullet.range(1).from(50).to(60);
   bullet.range(2).from(60).to(70);
   bullet.range(3).from(70).to(80);
   bullet.range(4).from(80).to(90);
   bullet.range(5).from(90).to(100);
   bullet.rangePalette().items(["#eee", "#ddd", "#ccc", "#bbb", "#aaa", "#999"]);

  return bullet;
  }

  function makeAxis (){
    var axis = anychart.standalones.axes.linear();
    var bulletScale = anychart.scales.linear();
    axis.scale(bulletScale);
    axis.padding(0, 10)
    bulletScale.minimum(0).maximum(100);
    bulletScale.ticks([0, 50, 80, 100]);
    return axis;
  }

  function calculatePercentToTarget(i) {

       var targetPercent = Math.round(myData[i]['accomplished']/myData[i]['target']*100);
       if (targetPercent > 100) return  targetPercent + '%';
       else return  targetPercent + '%';
   }

    function allStudGrade(myData, title, container){
      var  art =0 , beau = 0, cred =0, diver = 0, enou = 0, fail = 0;
      for (i = 0; i < myData.length; i++) {
        if (myData[i]['accomplished'] >= 90) {
          art++;
        }
        else if (myData[i]['accomplished'] >= 80 && myData[i]['accomplished'] < 90) {
          beau++;
        }
        else if (myData[i]['accomplished'] >= 70 && myData[i]['accomplished'] < 80) {
          cred++;
        }
        else if (myData[i]['accomplished'] >= 60 && myData[i]['accomplished'] < 70) {
          diver++;
        }
        else if (myData[i]['accomplished'] >= 50 && myData[i]['accomplished'] < 60) {
          enou++;
        }
        else {
          fail++
        }

      }
      var allGradeData = [
        {x: "A (90-100)", value: art},
        {x: "B (80-89)", value: beau},
        {x: "C (70-79)", value: cred},
        {x: "D (60-69)", value: diver},
        {x: "E (50-59)", value: enou},
        {x: "F (0-49)", value: fail}
      ];

      // create a chart
      chart = anychart.bar();

      // create a bar series and set the datachart = anychart.bar()
      var series = chart.bar(allGradeData);
      series.name("Total");
      series.selectionMode("none");

      chart.title('Total grade assessment');

      // set the container id
      chart.container("grade-container");

      // initiate drawing the chart
      chart.draw();
      }

    function allStudSections(myData, title, container){
      var  allListening =0 , allReading = 0, allWriting =0, allSpeaking = 0;
      for (i = 0; i < myData.length; i++) {
        allListening = allListening + myData[i]['sections']['listening'];
        allReading = allReading + myData[i]['sections']['reading'];
        allWriting = allWriting + myData[i]['sections']['writing'];
        allSpeaking = allSpeaking + myData[i]['sections']['speaking'];
      }
      var allSectData = [
        {x: "listening", value: allListening},
        {x: "reading", value: allReading},
        {x: "writing", value: allWriting},
        {x: "speaking", value: allSpeaking}
      ]
      chart = anychart.bar()
      var series = chart.bar(allSectData);
      series.name("Total");
      series.selectionMode("none");

      chart.title('Total sections assessment');

      series.normal().fill("#FF8C00");
      series.normal().stroke("#ef6d30");
      var tooltip = series.tooltip();

      chart.container("section-container");

    // initiate drawing the chart
      chart.draw();
    }

    function allSpeci(myData, title, container){
      var speci = 0, notSpeci = 0;
      for (i = 0; i < myData.length; i++) {
        if (myData[i]['specialized_subject'] == true) {
          speci++;
        }
        else{
          notSpeci++;
        }
      }
      var data = [
       {x: "Specialized", value: speci},
       {x: "Not specialized", value: notSpeci}
        ];

   // create a chart and set the data
   chart = anychart.pie(data);

   // set the chart title
   chart.title("Specialized subject assessment");

   // set the container id
   chart.container("speci-container");

   // initiate drawing the chart
   chart.draw();

    }
}
anychart.onDocumentReady(function () {
  var myData = students_data();
  myData = myData.sort(function (b, a) {
    return (a.accomplished - b.accomplished)
});

    // draw dashboard
    academic_performance_dashboard(myData);
});

$(window).on('load', function () {
    hidePreloader();
});