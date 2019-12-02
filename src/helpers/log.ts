export class Log {
  static logs: any = {};
  static logging = false;
  static dashboard: Element;
  static lastLoop = Date.now();

  static q(value, category = "general") {
    Log.logs[category] = value;

    if (!Log.logging) {
      Log.logging = true;
      Log.startLogging();
    }
  }

  static fps() {
    let thisLoop = Date.now();
    let fps = 1000 / (thisLoop - this.lastLoop);
    fps = Math.floor(fps);
    this.lastLoop = thisLoop;
    Log.logs.fps = fps;
  }

  static startLogging() {
    this.dashboard = document.createElement("div");
    this.dashboard.classList.add("dashboard");
    document.body.append(this.dashboard);

    setInterval(function() {
      Object.entries(Log.logs).forEach(value => {
        console.log(typeof value[1]);
        if (typeof value[1] === "number") {
          value[1] = value[1].toFixed(2);
        }
        Log.addToDashboard(value[0], value[1]);
      });
    }, 250);
  }

  static addToDashboard(category, value) {
    let entry = document.querySelector("." + category);

    if (entry) {
      entry.textContent = category + " : " + value;
      return;
    }

    entry = document.createElement("div");
    entry.classList.add(category);

    entry.append(document.createTextNode(category + " : " + value));

    this.dashboard.append(entry);
  }
}
