"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandMap = {
    start: {
        description: 'Start a server',
        name: 'start',
        startDefinitions: [
            {
                name: 'test',
                alias: 't',
                type: Boolean,
            },
            {
                name: 'profile',
                alias: 'p',
                type: String,
            },
            {
                name: 'exit',
                alias: 'e',
                description: 'Exit after test completion',
                type: Boolean,
            },
        ],
    },
    stop: {
        description: 'Stop a server',
        name: 'stop',
    },
    status: {
        description: 'Get the status of a server',
        name: 'status',
    },
    list: {
        description: 'List running SMA servers',
        name: 'list',
    },
    info: {
        description: 'Inspect a running server',
        name: 'info',
    },
    logs: {
        description: 'View logs for a server',
        name: 'logs',
    },
    restart: {
        description: 'Restart the server',
        name: 'restart',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZE1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbW1hbmRNYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLFVBQVUsR0FBRztJQUN0QixLQUFLLEVBQUU7UUFDSCxXQUFXLEVBQUUsZ0JBQWdCO1FBQzdCLElBQUksRUFBRSxPQUFPO1FBQ2IsZ0JBQWdCLEVBQUU7WUFDZDtnQkFDSSxJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsR0FBRztnQkFDVixJQUFJLEVBQUUsT0FBTzthQUNoQjtZQUNEO2dCQUNJLElBQUksRUFBRSxTQUFTO2dCQUNmLEtBQUssRUFBRSxHQUFHO2dCQUNWLElBQUksRUFBRSxNQUFNO2FBQ2Y7WUFDRDtnQkFDSSxJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsR0FBRztnQkFDVixXQUFXLEVBQUUsNEJBQTRCO2dCQUN6QyxJQUFJLEVBQUUsT0FBTzthQUNoQjtTQUNKO0tBQ0o7SUFFRCxJQUFJLEVBQUU7UUFDRixXQUFXLEVBQUUsZUFBZTtRQUM1QixJQUFJLEVBQUUsTUFBTTtLQUNmO0lBRUQsTUFBTSxFQUFFO1FBQ0osV0FBVyxFQUFFLDRCQUE0QjtRQUN6QyxJQUFJLEVBQUUsUUFBUTtLQUNqQjtJQUNELElBQUksRUFBRTtRQUNGLFdBQVcsRUFBRSwwQkFBMEI7UUFDdkMsSUFBSSxFQUFFLE1BQU07S0FDZjtJQUNELElBQUksRUFBRTtRQUNGLFdBQVcsRUFBRSwwQkFBMEI7UUFDdkMsSUFBSSxFQUFFLE1BQU07S0FDZjtJQUNELElBQUksRUFBRTtRQUNGLFdBQVcsRUFBRSx3QkFBd0I7UUFDckMsSUFBSSxFQUFFLE1BQU07S0FDZjtJQUNELE9BQU8sRUFBRTtRQUNMLFdBQVcsRUFBRSxvQkFBb0I7UUFDakMsSUFBSSxFQUFFLFNBQVM7S0FDbEI7Q0FDSixDQUFBIn0=