# FieldVerify - Check-in Validation (Agents)

## Distance Reference

The agent validation consists of calculating their distance to the establishment, setting a maximum distance of 100m to actually start their audit on site.

To establish this, let's use as an example an establishment with latitude and longitude, respectively, with the values:

```text
latitude: -22.64306554587935
longitude: -50.40488547381359
```

The way to understand and hypothetically place the agent's location based on this distance is based on the following understanding:

- Earth's circumference in km = +-40,000
- total degrees = 360

Distance of 1 degree:

```text
40,000 / 360 = 111.111 km
```

In the geographic coordinate system, 1 degree of latitude is approximately **111.111 kilometers**.

## Practical Examples

### Reference Distances

- 0.01 degrees being approximately 1.11km
- 0.001 degrees being approximately 111m
- 0.0001 degrees being approximately 11.1m

Now to apply the distance in practice, let's consider them:

### Same location as the establishment

```text
- latitude: -22.64306554587935
- longitude: -50.40488547381359
```

### Approximately 50m away from the location

add 0.0005 to the latitude value

```text
latitude: -22.64356554587935
longitude: -50.40488547381359
```

### Approximately 230m away from the location

add 0.0023 to the latitude value

```text
latitude: -22.64536554587935
longitude: -50.40488547381359
```

## Why Use Latitude Instead of Longitude?

Latitude is used in the examples because the distance represented by one degree of latitude remains approximately constant anywhere on Earth (about 111.111km per degree). Longitude behaves differently, as the distance represented by one degree of longitude varies depending on the latitude due the convergence of meridians toward the poles.

For this reason, adjusting only the latitude provides a simple and predictable way to create distance-based test scenarios.

## Supporting references

- https://www.sco.wisc.edu/2022/01/21/how-big-is-a-degree/
