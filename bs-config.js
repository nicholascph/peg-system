module.exports = {
"port": process.env.PORT || 3000,
"files": ["./dist/**/*.{html,htm,css,js}"],
"server": { "baseDir": "./dist" }
}
