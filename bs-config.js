module.exports = {
"port": process.env.port || 3000,
"files": ["./dist/**/*.{html,htm,css,js}"],
"server": { "baseDir": "./dist" }
}
