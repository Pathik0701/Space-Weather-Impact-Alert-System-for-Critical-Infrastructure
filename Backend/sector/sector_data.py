"""
Plain-language sector impact + action lookup table.

This is the core "innovation" layer described in the project brief:
NOAA/ISRO already publish raw Kp-index and X-ray flux numbers. Nobody
translates that into "what does this mean for my sector, right now,
and what should I do about it." This table does that translation.

Effects are grounded in NOAA's published G-scale (geomagnetic storm)
and R-scale (radio blackout) descriptions:
https://www.swpc.noaa.gov/noaa-scales-explanation
"""

from models.risk import InfrastructureType, RiskLevel

# risk_service.py's RiskLevel is a 5-tier scale (NORMAL, WATCH,
# ADVISORY, WARNING, CRITICAL). This maps roughly onto the brief's
# 4-tier Kp scale (Low/Moderate/High/Severe), with WATCH acting as
# an early-warning tier between Low and Moderate.

SECTOR_IMPACT_TABLE: dict[InfrastructureType, dict[RiskLevel, dict[str, str]]] = {
    InfrastructureType.POWER_GRID: {
        RiskLevel.NORMAL: {
            "impact": "No measurable induced current risk to transmission lines.",
            "action": "No action needed. Routine monitoring only.",
        },
        RiskLevel.WATCH: {
            "impact": "Minor geomagnetically induced currents possible on long lines.",
            "action": "No operational change. Note the trend for the next few hours.",
        },
        RiskLevel.ADVISORY: {
            "impact": "Weak power grid fluctuations possible; voltage corrections may be needed.",
            "action": "Alert grid operators. Avoid non-essential switching operations.",
        },
        RiskLevel.WARNING: {
            "impact": "Possible voltage instability; transformer heating risk on long transmission lines.",
            "action": "Postpone non-essential switching. Monitor transformer temperatures closely.",
        },
        RiskLevel.CRITICAL: {
            "impact": "Widespread voltage control problems possible; some protective systems may trip transformers offline (as in the 1989 Quebec blackout).",
            "action": "Activate storm response protocol. Have manual override ready for automatic protection systems.",
        },
    },
    InfrastructureType.TELECOMMUNICATIONS: {
        RiskLevel.NORMAL: {
            "impact": "No disruption to satellite or broadcast links.",
            "action": "No action needed.",
        },
        RiskLevel.WATCH: {
            "impact": "Minor HF radio degradation possible at high latitudes.",
            "action": "No operational change. Monitor NOAA R-scale updates.",
        },
        RiskLevel.ADVISORY: {
            "impact": "Limited HF radio blackout on sunlit side; low-frequency navigation signals may degrade.",
            "action": "Notify HF radio users of possible signal degradation.",
        },
        RiskLevel.WARNING: {
            "impact": "Wide-area HF radio blackout likely for an hour or more; satellite comms glitches possible.",
            "action": "Switch critical comms to backup links. Monitor satellite uplink quality.",
        },
        RiskLevel.CRITICAL: {
            "impact": "HF radio blackout across most of the sunlit side for extended periods; satellite navigation and low-frequency systems degraded for hours.",
            "action": "Activate backup communication channels. Delay non-essential satellite operations.",
        },
    },
    InfrastructureType.AVIATION: {
        RiskLevel.NORMAL: {
            "impact": "No impact to flight operations.",
            "action": "No action needed.",
        },
        RiskLevel.WATCH: {
            "impact": "Slight radiation dose increase possible on polar routes.",
            "action": "No operational change. Routine awareness for polar-route crews.",
        },
        RiskLevel.ADVISORY: {
            "impact": "Possible HF radio degradation on polar routes; minor GPS accuracy loss.",
            "action": "Advise polar-route flights of possible comms/nav degradation.",
        },
        RiskLevel.WARNING: {
            "impact": "HF radio blackout likely on polar routes; GPS-based navigation accuracy notably reduced.",
            "action": "Expect rerouting advisories for polar flights. Increase reliance on backup nav systems.",
        },
        RiskLevel.CRITICAL: {
            "impact": "Polar routes may be unflyable on HF radio; radiation exposure and nav degradation both significant.",
            "action": "Reroute polar flights to lower latitudes. Ground crew radiation exposure monitoring advised.",
        },
    },
    InfrastructureType.RAILWAYS: {
        RiskLevel.NORMAL: {
            "impact": "GPS-based signaling accuracy unaffected.",
            "action": "No action needed.",
        },
        RiskLevel.WATCH: {
            "impact": "Sub-meter GPS accuracy drift possible.",
            "action": "No operational change.",
        },
        RiskLevel.ADVISORY: {
            "impact": "GPS accuracy degradation of a few meters possible; affects precision-dependent signaling.",
            "action": "Increase manual verification of GPS-dependent signaling checkpoints.",
        },
        RiskLevel.WARNING: {
            "impact": "Several-meter GPS accuracy degradation likely; automated signaling may be unreliable.",
            "action": "Fall back to manual signaling protocols on GPS-dependent sections.",
        },
        RiskLevel.CRITICAL: {
            "impact": "GPS-based signaling may be unreliable across affected regions for hours.",
            "action": "Switch to manual block signaling on precision-critical routes until conditions ease.",
        },
    },
}


def get_sector_impact(
    infrastructure: InfrastructureType, level: RiskLevel
) -> dict[str, str]:
    return SECTOR_IMPACT_TABLE[infrastructure][level]
