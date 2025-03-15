const claimedIps = new Map(); // Stores IPs with timestamps
const claimedCookies = new Map(); // Stores cookies with timestamps
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes cooldown

module.exports = (req, res, next) => {
    const userIP = req.ip;
    const userCookie = req.cookies?.couponClaimed;
    const currentTime = Date.now();

    // 🛑 Check IP-based abuse prevention
    if (claimedIps.has(userIP) && currentTime - claimedIps.get(userIP) < COOLDOWN_TIME) {
        return res.status(429).json({ message: "Too many claims from this IP. Try again later." });
    }

    // 🛑 Check Cookie-based abuse prevention
    if (userCookie && claimedCookies.has(userCookie) && currentTime - claimedCookies.get(userCookie) < COOLDOWN_TIME) {
        return res.status(429).json({ message: "You have already claimed a coupon in this session." });
    }

    // ✅ Store the claim time for abuse prevention
    claimedIps.set(userIP, currentTime);

    // ✅ Generate a unique cookie if not set
    if (!userCookie) {
        const randomCookie = Math.random().toString(36).substring(7);
        res.cookie("couponClaimed", randomCookie, { maxAge: COOLDOWN_TIME, httpOnly: true });
        claimedCookies.set(randomCookie, currentTime);
    } else {
        claimedCookies.set(userCookie, currentTime);
    }

    // Remove old entries after cooldown
    setTimeout(() => claimedIps.delete(userIP), COOLDOWN_TIME);
    setTimeout(() => claimedCookies.delete(userCookie), COOLDOWN_TIME);

    next();
};
