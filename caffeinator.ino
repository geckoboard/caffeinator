// This #include statement was automatically added by the Particle IDE.
#include "RunningAverage/RunningAverage.h"

// This #include statement was automatically added by the Particle IDE.
#include "EmonLib/EmonLib.h"
EnergyMonitor emon1;
RunningAverage samples(10);
int i = 0;
bool brewin = false;
unsigned long startTime;
unsigned long brewTime = 0;
double power;

static const int LOWER_THRESHOLD = 200;
static const int UPPER_THRESHOLD = 1000;

void setup()
{
  Spark.variable("power", &power, DOUBLE);
  Spark.variable("brewin", &brewin, BOOLEAN);
  Spark.variable("brew_time", &brewTime, INT);
  emon1.current(1, 111.1);             // Current: input pin, calibration.
}

void loop()
{
  double Irms = emon1.calcIrms(1480);  // Calculate Irms only
  i++;
  samples.addValue(Irms * 230);

  if (i == 20) {
    power = samples.getAverage();
    samples.clear();
    i = 0;

    if (brewin) {
        brewTime = millis() - startTime;
    }

    if (power < LOWER_THRESHOLD && brewin) {
        brewin = false;
        Spark.publish("finished_brewin", (String)brewTime);
    }

    if (power > UPPER_THRESHOLD && !brewin) {
        startTime = millis();
        brewin = true;
        Spark.publish("started_brewin");
    }
  }
}
