import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";


// ======================================
// VISUAL NOVEL CUSTOMER SERVICE SIMULATOR
// Includes all workplace scenarios
// Ensures consistent character voices
// ======================================

const scenarios = {
    product_issue: { 
        title: "Product Not Working", 
        start: "start",
        music: "https://clubunited.ph/wrapup/product.mp3", 
        nodes: { 
          start: { 
            character: "Customer", 
            emotion: "angry", 
            text: "I bought your device two days ago and it already stopped working. I'm extremely disappointed.", 
            image: "https://i.ibb.co/6KWqLH9/customer-angry.png", 
            choices: [
              { text: "Apologize and ask questions", next: "investigate_support" }, 
              { text: "Request receipt first", next: "policy_support" }] }, 
          investigate_support: { 
            character: "Support Agent", 
            emotion: "calm", 
            text: "I understand your frustration. Can you tell me exactly what happened so we can fix it quickly?", 
            image: "https://i.ibb.co/DD2tgY4w/agent-calm.png", 
            choices: [
              { text: "Next", next: "investigate" }] },
          policy_support: { 
            character: "Support Agent", 
            emotion: "calm", 
            text: "I apologize if that feels inconvenient. Our store policy requires us to check the receipt first before we can provide support like returns, replacements, or repairs. It helps us confirm the purchase details and make sure we assist you properly.", 
            image: "https://i.ibb.co/DD2tgY4w/agent-calm.png", 
            choices: [
               { text: "Next", next: "policy" } ] }, 
          policy_support2: { 
            character: "Support Agent", 
            emotion: "calm", 
            text: "I completely understand how frustrating it can be when an item isn’t working and you’re trying to get help. I truly want to assist you with this. However, our store policy requires us to verify the receipt first before we can proceed with checking the item or providing support.", 
            image: "https://i.ibb.co/DD2tgY4w/agent-calm.png", 
            choices: [
               { text: "Next", next: "customer_receipt" } ] }, 
          policy: { 
            character: "Customer", 
            emotion: "annoyed", 
            text: "So before even helping me you want paperwork?", 
            image: "https://i.ibb.co/6KWqLH9/customer-angry.png", 
            choices: [
              { text: "Explain policy calmly", next: "policy_support2" }, 
              { text: "Double down on policy", next: "double_down_policy" }] }, 
          customer_receipt: { 
            character: "Customer", 
            emotion: "calm", 
            text: "Oh, I see. I might have it in my bag. Let me check it... Here you go.", 
            image: "https://i.ibb.co/YFfd0nZc/customer-frustrated.png", 
            choices: [
              { text: "Get the gadget and investigate", next: "investigate_support" }, 
              { text: "Keep him in que even the official receipt has presented", next: "bad_end" }] }, 
          support_receipt: { 
            character: "Customer", 
            emotion: "calm", 
            text: "Thank you for looking and providing the receipt. We have verified your purchase. Can tell me exactly what happened so we can fix it quickly?",
            image: "https://i.ibb.co/6KWqLH9/customer-angry.png",
            choices: [
              { text: "Get the gadget and investigate", next: "investigate" } ] },
          double_down_policy: { 
            character: "Support Agent", 
            emotion: "angry", 
            text: "If you don't have it then I can’t help you. It doesn’t matter where you bought it. No receipt, no support. That’s the rule!", 
            image: "https://i.ibb.co/gbHS5q5R/agent-annoyed.png", 
            choices: [
              { text: "Next", next: "bad_end" }] },      
          investigate: { 
            character: "Customer", 
            emotion: "frustrated", 
            text: "It stopped powering on completely. I charged it overnight.", 
            image: "https://i.ibb.co/YFfd0nZc/customer-frustrated.png", 
            choices: [
              { text: "Walk through troubleshooting", next: "diagnose" }, 
              { text: "Offer replacement immediately", next: "replacement" }] }, 
          diagnose: { 
            character: "Support Agent", 
            emotion: "calm", 
            text: "Let's try a quick reset process together.", 
            image: "https://i.ibb.co/DD2tgY4w/agent-calm.png", 
            randomOutcomes: [
              { chance: 0.4, next: "good_end" }, 
              { chance: 0.3, next: "neutral_end" }] },  
          replacement: { 
            character: "Customer", 
            emotion: "uncertain", 
            text: "You're willing to replace it already?", 
            image: "https://i.ibb.co/YFfd0nZc/customer-frustrated.png", 
            randomOutcomes: [
              { chance: 0.5, next: "good_end" }, 
              { chance: 0.5, next: "neutral_end" }] }, 
          good_end: { 
            character: "Customer", 
            emotion: "happy", 
            text: "Thank you for actually helping me solve it.", 
            image: "https://i.ibb.co/wZXV6hp8/customer-happy.png", 
            ending: "Excellent Resolution", 
            learning: "Empathy combined with flexible problem solving increases customer trust and satisfaction." }, 
          neutral_end: { 
            character: "Customer", 
            emotion: "uncertain", 
            text: "I guess we'll see if that works...", 
            image: "https://i.ibb.co/YFfd0nZc/customer-frustrated.png", 
            ending: "Partial Resolution", 
            learning: "Even correct solutions can feel unsatisfying if the customer still feels uncertain. Communication clarity matters." }, 
          bad_end: { 
            character: "Customer", 
            emotion: "angry", 
            text: "This is terrible support. I'm posting a complaint online.", 
            image: "https://i.ibb.co/6KWqLH9/customer-angry.png", 
            ending: "Customer Escalation", 
            learning: "Rigid policy-first responses can escalate emotional customers. Listening first often prevents escalation." } 
    }},
    rewards_release: { 
        title: "Rewards Release Delay", 
        start: "start", 
        music: "https://clubunited.ph/wrapup/rewards.mp3", 
        nodes: {

          start: { 
            character: "Rewards Officer", 
            emotion: "worried", 
            text: "I'm seeing a lot of complaints from users saying their rewards haven't been issued yet. The RMS dashboard shows several rewards stuck in pending status. What should we do first?", 
            image: "https://i.ibb.co/v68sF97S/rewards-worried.png", 
            choices: [
              { text: "Investigate RMS system logs", next: "checkLogs" }, 
              { text: "Post announcement to calm users", next: "informUsers" },
              { text: "Wait and see if rewards process later", next: "waitDecision" }]},

              checkLogs: { 
                    character: "Rewards Officer", 
                    emotion: "focused", 
                    text: "After checking the RMS logs, I found that the reward issuance batch job failed two days ago. The queue stopped processing rewards. Should we escalate this?", 
                    image: "https://i.ibb.co/v68sF97S/rewards-worried.png", 
                    choices: [
                    { text: "Escalate to technical team immediately", next: "goodEnding1" },
                    { text: "Manually issue the rewards ourselves", next: "neutralEnding1" },
                    { text: "Wait for the next automated batch", next: "badEnding1" }]},

              informUsers: { 
                    character: "Community Manager", 
                    emotion: "concerned", 
                    text: "We've posted a message telling users we're investigating the delay. Some users are calmer now, but we still don't know the root cause.", 
                    image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png",
                    choices: [
                    { text: "Investigate the RMS system now", next: "goodEnding2" },
                    { text: "Let community team reply to complaints individually", next: "neutralEnding2" },
                    { text: "Wait for more complaints before acting", next: "badEnding2" }]},

              waitDecision: { 
                    character: "Program Community Coordinator", 
                    emotion: "stressed", 
                    text: "Complaints doubled in the community channels. People are questioning if the rewards program is reliable.", 
                    image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
                    choices: [
                    { text: "Investigate the issue urgently now", next: "neutralEnding3" },
                    { text: "Hide or moderate complaint posts", next: "badEnding3" },
                    { text: "Continue waiting for automatic processing", next: "badEnding4" }]},
  
              goodEnding1: { 
                    character: "Technical Team", 
                    emotion: "relieved", 
                    text: "The engineers restarted the failed reward service and cleared the queue. Rewards are now being issued gradually.", 
                    image: "https://i.ibb.co/CK9q0G97/engineer.png",
                    ending: "GOOD ENDING — System Fixed Quickly", 
                    learning: "Escalating technical issues quickly helps resolve problems efficiently and maintains user trust." 
              },
  
              neutralEnding1: { 
                    character: "Rewards Officer", 
                    emotion: "tired", 
                    text: "We manually processed the pending rewards. Users received them, but it took hours and didn't solve the root issue.", 
                    image: "https://i.ibb.co/gbgthS6T/rewards-sad.png", 
                    ending: "NEUTRAL ENDING — Temporary Fix", 
                    learning: "Manual workarounds may help temporarily but identifying the root cause is critical." 
              },
  
              badEnding1: { 
                    character: "Community Manager", 
                    emotion: "frustrated", 
                    text: "The automated batch failed again the next day. Now hundreds of users are complaining about missing rewards.", 
                    image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
                    ending: "BAD ENDING — Escalation Crisis", 
                    learning: "Delaying action when technical failures occur can significantly damage user trust." 
              },
  
              goodEnding2: { 
                    character: "Rewards Officer", 
                    emotion: "relieved", 
                    text: "After investigating, we discovered a failed reward job in the RMS. The technical team fixed it and rewards are being issued.", 
                    image: "https://i.ibb.co/SDVGpZWc/rewards-happy.png", 
                    ending: "GOOD ENDING — Transparent Resolution", 
                    learning: "Communicating early while investigating helps maintain community trust." 
              },
  
              neutralEnding2: { 
                    character: "Community Manager", 
                    emotion: "exhausted", 
                    text: "The team spent hours replying to users individually, but the system issue was only discovered later.", 
                    image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
                    ending: "NEUTRAL ENDING — Reactive Support", 
                    learning: "Handling complaints without diagnosing the root cause increases workload." 
              },
  
              badEnding2: { 
                    character: "Program Community Coordinator", 
                    emotion: "disappointed", 
                    text: "Users became frustrated after hearing no updates for days. Many started doubting the rewards program.", 
                    image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
                    ending: "BAD ENDING — Lost Confidence", 
                    learning: "Delayed investigation after communication can lead to community distrust." 
              },
  
              neutralEnding3: { 
                    character: "Rewards Officer", 
                    emotion: "stressed", 
                    text: "We eventually found the system issue and fixed it, but users were already frustrated from the delay.", 
                    image: "https://i.ibb.co/v68sF97S/rewards-worried.png", 
                    ending: "NEUTRAL ENDING — Late Recovery", 
                    learning: "Acting late can still resolve issues but may already harm the community's perception." 
              },
  
              badEnding3: { 
                    character: "Community Manager", 
                    emotion: "worried", 
                    text: "Moderating complaint posts only pushed the conversation to external channels where the situation escalated.", 
                    image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
                    ending: "BAD ENDING — Reputation Risk", 
                    learning: "Suppressing user concerns rarely solves the problem and may worsen trust issues." 
              },
  
              badEnding4: { 
                    character: "Rewards Officer", 
                    emotion: "overwhelmed", 
                    text: "The backlog of rewards kept growing and leadership demanded an urgent investigation into the operational failure.", 
                    image: "https://i.ibb.co/gbgthS6T/rewards-sad.png", 
                    ending: "BAD ENDING — Operational Breakdown", 
                    learning: "Ignoring operational warning signs can lead to major service failures." 
              }
    }},
    platform_it_issue: { 
            title: "Platform Service Disruption", 
            start: "start", 
            music: "https://blueoceancrew.net/VN-BGM/platform_it.mp3",

            nodes: {

            start: { 
            character: "Technical Support", 
            emotion: "concerned", 
            text: "Team, something is wrong with the platform. Users are reporting that pages are loading slowly and some features like task submissions and rewards tracking are not working. This might be a platform issue.", 
            image: "https://i.ibb.co/27NqkY26/IT.png", 
            choices: [
            { text: "Check system monitoring dashboard and server status", next: "checkMonitoring" },
            { text: "Notify the IT team immediately", next: "notifyIT" },
            { text: "Wait to see if the platform stabilizes", next: "waitPlatform" }
            ]},

            checkMonitoring: { 
                    character: "Technical Support", 
                    emotion: "focused", 
                    text: "I'm checking the monitoring tools now. CPU usage on one of the platform servers is unusually high and response times are increasing.", 
                    image: "https://i.ibb.co/27NqkY26/IT.png", 
                    choices: [
                    { text: "Escalate findings to IT team with monitoring data", next: "goodEnding1" },
                    { text: "Restart the affected service to see if it helps", next: "neutralEnding1" },
                    { text: "Ignore it for now and continue monitoring", next: "badEnding1" }
                    ]},

            notifyIT: { 
                    character: "Community Manager", 
                    emotion: "alert", 
                    text: "IT team has been notified about the platform slowdown. They're asking if we have more details about the issue or error patterns.", 
                    image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png",
                    choices: [
                    { text: "Gather logs and user reports to help IT diagnose", next: "goodEnding2" },
                    { text: "Ask IT to investigate without additional data", next: "neutralEnding2" },
                    { text: "Assume IT will fix it and stop monitoring", next: "badEnding2" }
                    ]},

            waitPlatform: { 
                    character: "Program Community Coordinator", 
                    emotion: "worried", 
                    text: "More reports are coming in. Users now say the dashboard sometimes shows errors and tasks cannot be submitted.", 
                    image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
                    choices: [
                    { text: "Investigate system health and logs immediately", next: "neutralEnding3" },
                    { text: "Tell users to refresh or try again later", next: "badEnding3" },
                    { text: "Continue waiting for the system to recover", next: "badEnding4" }
                    ]},

            goodEnding1: { 
                    character: "IT Engineer", 
                    emotion: "relieved", 
                    text: "The monitoring data helped us quickly identify a misconfigured server process consuming too many resources. We fixed the configuration and restarted the service. Platform performance is back to normal.", 
                    image: "https://i.ibb.co/CK9q0G97/engineer.png",
                    ending: "GOOD ENDING — Issue Diagnosed Quickly", 
                    learning: "Monitoring tools and system metrics are essential for quickly diagnosing platform performance issues." 
                    },

            neutralEnding1: { 
                    character: "Technical Support", 
                    emotion: "uncertain", 
                    text: "Restarting the service helped temporarily, but the slowdown returned later because the root cause was not fully identified.", 
                    image: "https://i.ibb.co/27NqkY26/IT.png", 
                    ending: "NEUTRAL ENDING — Temporary Stability", 
                    learning: "Restarting services can restore functionality temporarily but may not solve the underlying issue." 
                    },

            badEnding1: { 
                    character: "Community Manager", 
                    emotion: "frustrated", 
                    text: "While we continued monitoring, the platform performance worsened and eventually caused partial downtime for several features.", 
                    image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
                    ending: "BAD ENDING — Platform Degradation", 
                    learning: "Ignoring warning signs in monitoring tools can lead to larger system failures." 
                    },

            goodEnding2: { 
            character: "IT Engineer", 
                    emotion: "focused", 
                    text: "Thanks for the logs and user reports. We traced the issue to a database query overload affecting platform response time. We've optimized the query and stabilized the system.", 
                    image: "https://i.ibb.co/CK9q0G97/engineer.png",
                    ending: "GOOD ENDING — Collaborative Troubleshooting", 
                    learning: "Providing technical evidence helps IT teams diagnose and resolve platform issues faster." 
                    },

            neutralEnding2: { 
                    character: "Program Community Coordinator", 
                    emotion: "tired", 
                    text: "IT eventually found the issue, but without initial data the investigation took much longer than necessary.", 
                    image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
                    ending: "NEUTRAL ENDING — Slow Resolution", 
                    learning: "Clear technical information accelerates troubleshooting and incident response." 
                    },

            badEnding2: { 
                    character: "Program Community Coordinator", 
                    emotion: "worried", 
                    text: "Because we stopped monitoring after notifying IT, we failed to notice the issue spreading to other services on the platform.", 
                    image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
                    ending: "BAD ENDING — Escalating System Failure", 
                    learning: "Even after escalation, teams must continue monitoring platform health during incidents." 
                    },

            neutralEnding3: { 
                    character: "IT Engineer", 
                    emotion: "focused", 
                    text: "After investigating late, we discovered a memory leak affecting one of the platform services. It was fixed, but users experienced disruption for several hours.", 
                    image: "https://i.ibb.co/CK9q0G97/engineer.png",
                    ending: "NEUTRAL ENDING — Late Recovery", 
                    learning: "Delayed investigation can still resolve the problem but may impact the user experience." 
                    },

            badEnding3: { 
                    character: "Community Manager", 
                    emotion: "disappointed", 
                    text: "Telling users to refresh did not solve the real problem. The platform continued failing and frustration grew among users.", 
                    image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
                    ending: "BAD ENDING — User Frustration", 
                    learning: "Workarounds should not replace proper investigation during platform incidents." 
                    },

            badEnding4: { 
                    character: "Program Community Coordinator", 
                    emotion: "overwhelmed", 
                    text: "The platform eventually crashed due to unresolved system overload, forcing emergency downtime and urgent intervention from IT leadership.", 
                    image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
                    ending: "BAD ENDING — Critical Platform Outage", 
                    learning: "Ignoring early warning signs in platform performance can lead to full system outages." 
                    }
    }},
    it_support_ticket_delay: { 
        title: "IT Support Ticket Backlog", 
        start: "start", 
        music: "https://blueoceancrew.net/VN-BGM/support_ticket.mp3",

        nodes: {

        start: { 
        character: "Program Community Coordinator", 
        emotion: "worried", 
        text: "Team, several users are asking about their IT support tickets. Some tickets have been open for days without updates. The backlog seems to be growing in the system.", 
        image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
        choices: [
        { text: "Review the ticketing system and backlog status", next: "reviewBacklog" },
        { text: "Send a message acknowledging the delays to users", next: "informUsers" },
        { text: "Wait for IT to process the tickets naturally", next: "waitIT" }
        ] 
        },

            reviewBacklog: { 
            character: "Rewards Officer", 
            emotion: "focused", 
            text: "Looking at the ticketing dashboard, there are over 80 unresolved tickets. Many are related to platform login issues and reward verification errors.", 
            image: "https://i.ibb.co/v68sF97S/rewards-worried.png",
            choices: [
            { text: "Prioritize critical tickets and escalate to IT manager", next: "goodEnding1" },
            { text: "Start responding to tickets one by one", next: "neutralEnding1" },
            { text: "Leave the tickets since IT will eventually resolve them", next: "badEnding1" }
            ]
            },

            informUsers: { 
            character: "Community Manager", 
            emotion: "alert", 
            text: "We've posted an update informing users that the IT team is reviewing the ticket backlog and responses may take longer than usual.", 
            image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png",
            choices: [
            { text: "Coordinate with IT to prioritize urgent tickets", next: "goodEnding2" },
            { text: "Let users keep submitting tickets for follow-ups", next: "neutralEnding2" },
            { text: "Stop providing updates after the first announcement", next: "badEnding2" }
            ]
            },

            waitIT: { 
            character: "Program Community Coordinator", 
            emotion: "stressed", 
            text: "The backlog is getting worse. Some users are now submitting duplicate tickets because they haven't received responses.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            choices: [
            { text: "Audit the ticket queue and identify urgent cases", next: "neutralEnding3" },
            { text: "Close older tickets automatically", next: "badEnding3" },
            { text: "Continue waiting for IT to catch up", next: "badEnding4" }
            ]
            },

            goodEnding1: { 
            character: "IT Manager", 
            emotion: "relieved", 
            text: "Thanks for flagging the backlog. We've reassigned engineers to address the critical tickets first and implemented a priority queue.", 
            image: "https://i.ibb.co/LjCqcKb/it-manager-neutral.png",
            ending: "GOOD ENDING — Efficient Ticket Resolution", 
            learning: "Prioritizing and escalating urgent support tickets helps resolve issues faster and improves support efficiency." 
            },

            neutralEnding1: { 
            character: "Rewards Officer", 
            emotion: "tired", 
            text: "Responding to tickets individually helped reduce the backlog slightly, but the queue kept growing because the core issues were not prioritized.", 
            image: "https://i.ibb.co/gbgthS6T/rewards-sad.png",
            ending: "NEUTRAL ENDING — Slow Progress", 
            learning: "Handling tickets one by one may help temporarily but prioritization and coordination are essential." 
            },

            badEnding1: { 
            character: "Community Manager", 
            emotion: "frustrated", 
            text: "Because the backlog was ignored, users started escalating their concerns through multiple channels and management demanded an urgent report.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            ending: "BAD ENDING — Support Breakdown", 
            learning: "Ignoring a growing ticket backlog can lead to operational and reputational issues." 
            },

            goodEnding2: { 
            character: "IT Engineer", 
            emotion: "focused", 
            text: "After coordinating with the support team, we identified the most common issues and deployed fixes while resolving high-priority tickets.", 
            image: "https://i.ibb.co/CK9q0G97/engineer.png",
            ending: "GOOD ENDING — Coordinated Support Response", 
            learning: "Combining user communication with internal coordination ensures both transparency and faster problem resolution." 
            },

            neutralEnding2: { 
            character: "Program Community Coordinator", 
            emotion: "concerned", 
            text: "Users continued submitting follow-ups, which created duplicate tickets and made the backlog harder to manage.", 
            image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png",
            ending: "NEUTRAL ENDING — Ticket Overflow", 
            learning: "Without ticket management policies, duplicate submissions can overwhelm support teams." 
            },

            badEnding2: { 
            character: "Community Manager", 
            emotion: "disappointed", 
            text: "Users became frustrated after receiving no updates beyond the initial announcement, leading to loss of confidence in the support process.", 
            image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png",
            ending: "BAD ENDING — Communication Failure", 
            learning: "Announcements must be followed by consistent updates during support delays." 
            },

            neutralEnding3: { 
            character: "IT Engineer", 
            emotion: "focused", 
            text: "After auditing the queue, several urgent cases were finally addressed. However, many users experienced long waiting times.", 
            image: "https://i.ibb.co/CK9q0G97/engineer.png",
            ending: "NEUTRAL ENDING — Delayed Resolution", 
            learning: "Late intervention can still improve ticket management but may impact user satisfaction." 
            },

            badEnding3: { 
            character: "Program Community Coordinator", 
            emotion: "worried", 
            text: "Automatically closing tickets caused users to reopen them and escalate complaints about unresolved issues.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            ending: "BAD ENDING — Escalated Complaints", 
            learning: "Closing unresolved tickets without solutions damages trust in the support system." 
            },

            badEnding4: { 
            character: "Rewards Officer", 
            emotion: "overwhelmed", 
            text: "The backlog doubled and leadership required an emergency review of the support process due to poor response times.", 
            image: "https://i.ibb.co/gbgthS6T/rewards-sad.png",
            ending: "BAD ENDING — Critical Support Failure", 
            learning: "Ignoring ticket backlogs can quickly escalate into major operational problems." 
            }
    }}, 
    operations_delay: { 
        title: "Operations Processing Delay", 
        start: "start", 
        music: "https://blueoceancrew.net/VN-BGM/operations_delay.mp3",

        nodes: {

        start: { 
        character: "Program Community Coordinator", 
        emotion: "concerned", 
        text: "Multiple operations tasks and reward approvals are delayed. Users are asking when their requests will be processed. The operations backlog is growing.", 
        image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
        choices: [
        { text: "Review pending operations tasks and prioritize urgent ones", next: "reviewTasks" },
        { text: "Inform users about potential delays", next: "notifyUsers" },
        { text: "Wait and hope the operations queue clears", next: "waitQueue" }
        ] 
        },

            reviewTasks: { 
            character: "Program Community Coordinator", 
            emotion: "focused", 
            text: "I'm reviewing all pending tasks. Some reward approvals have been pending for days, others are time-sensitive.", 
            image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
            choices: [
            { text: "Escalate high-priority tasks to Operations Manager", next: "goodEnding1" },
            { text: "Assign tasks evenly without prioritization", next: "neutralEnding1" },
            { text: "Postpone escalation until backlog becomes critical", next: "badEnding1" }
            ]
            },

            notifyUsers: { 
            character: "Program Community Coordinator", 
            emotion: "alert", 
            text: "I sent a notice: 'Operations is experiencing delays. Requests will be processed as soon as possible.' Users want clearer timelines.", 
            image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
            choices: [
            { text: "Coordinate with Operations Manager to prioritize tasks and update users", next: "goodEnding2" },
            { text: "Let Operations handle the backlog without further updates", next: "neutralEnding2" },
            { text: "Assume users will wait and stop monitoring progress", next: "badEnding2" }
            ]
            },

            waitQueue: { 
            character: "Program Community Coordinator", 
            emotion: "stressed", 
            text: "The backlog is growing. Users are submitting multiple follow-ups, creating confusion and more pressure.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            choices: [
            { text: "Audit backlog and escalate urgent tasks immediately", next: "neutralEnding3" },
            { text: "Ignore follow-ups and hope Operations catch up", next: "badEnding3" },
            { text: "Continue waiting without intervention", next: "badEnding4" }
            ]
            },

            goodEnding1: { 
            character: "Operations Manager", 
            emotion: "relieved", 
            text: "Critical tasks were processed first. Users received rewards and approvals on time, and backlog was cleared.", 
            image: "https://i.ibb.co/sJsh0hbC/om-happy.png",
            ending: "GOOD ENDING — Fast Escalation and Prioritization", 
            learning: "Prioritizing and escalating urgent operations tasks prevents user frustration and backlog growth." 
            },

            neutralEnding1: { 
            character: "Operations Team", 
            emotion: "busy", 
            text: "Tasks were evenly assigned, but urgent requests were delayed. Backlog cleared eventually, but users were frustrated.", 
            image: "https://i.ibb.co/KxKYnGk6/busy.png",
            ending: "NEUTRAL ENDING — Moderate Delay", 
            learning: "Even task distribution without prioritization may delay high-impact tasks." 
            },

            badEnding1: { 
            character: "Program Community Coordinator", 
            emotion: "frustrated", 
            text: "Postponing escalation caused critical tasks to remain unprocessed. Users flooded support channels.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "BAD ENDING — Escalation Failure", 
            learning: "Delaying escalation in operations leads to backlog accumulation and user dissatisfaction." 
            },

            goodEnding2: { 
            character: "Operations Manager", 
            emotion: "focused", 
            text: "Coordination allowed urgent tasks to be processed first. Users were updated, maintaining trust.", 
            image: "https://i.ibb.co/sJsh0hbC/om-happy.png",
            ending: "GOOD ENDING — Transparent Coordination", 
            learning: "Combining communication with prioritization ensures efficiency and user satisfaction." 
            },

            neutralEnding2: { 
            character: "Program Community Coordinator", 
            emotion: "tired", 
            text: "Operations processed tasks eventually, but users experienced longer waits and multiple follow-ups.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "NEUTRAL ENDING — Delayed Resolution", 
            learning: "Without active coordination, delays may persist even if tasks are eventually completed." 
            },

            badEnding2: { 
            character: "Program Community Coordinator", 
            emotion: "worried", 
            text: "Stopping updates caused users to lose confidence and escalate complaints externally.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "BAD ENDING — User Frustration", 
            learning: "Failing to monitor and update users damages trust." 
            },

            neutralEnding3: { 
            character: "Operations Team", 
            emotion: "focused", 
            text: "Late escalation allowed urgent tasks to be processed, but users experienced delays and frustration.", 
            image: "https://i.ibb.co/KxKYnGk6/busy.png",
            ending: "NEUTRAL ENDING — Late Recovery", 
            learning: "Late intervention resolves tasks but may negatively affect user satisfaction." 
            },

            badEnding3: { 
            character: "Program Community Coordinator", 
            emotion: "disappointed", 
            text: "Ignoring follow-ups led to duplicate tasks and unresolved requests.", 
            image: "https://i.ibb.co/svC0TWb4/om-sad.png",
            ending: "BAD ENDING — Backlog Escalation", 
            learning: "Ignoring operational backlog or follow-ups compounds delays." 
            },

            badEnding4: { 
            character: "Program Community Coordinator", 
            emotion: "overwhelmed", 
            text: "Backlog continued growing unchecked, forcing management intervention.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "BAD ENDING — Critical Operations Failure", 
            learning: "Active monitoring and escalation prevent operational collapse." 
            }
    }},
    pcc_creative_conflict: { 
        title: "Poster Request Conflict", 
        start: "start", 
        music: "https://blueoceancrew.net/VN-BGM/creative_conflict.mp3",

        nodes: {

        start: { 
        character: "Program Community Coordinator", 
        emotion: "concerned", 
        text: "The Creative Director rejected the poster request I submitted for the program campaign. They said the brief was unclear and the design direction doesn't align with the brand. But the campaign deadline is approaching and the community is waiting for the announcement.", 
        image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
        choices: [
        { text: "Clarify the design brief and campaign objectives with the Creative Director", next: "clarifyBrief" },
        { text: "Ask the Creative Director to revise the design urgently", next: "urgentRequest" },
        { text: "Bypass the Creative Director and ask a designer directly", next: "bypassDirector" }
        ] 
        },

            clarifyBrief: { 
            character: "Creative Director", 
            emotion: "focused", 
            text: "Thanks for clarifying the campaign goals. The previous brief lacked details about audience, message hierarchy, and design guidelines.", 
            image: "https://i.ibb.co/nNBC069L/director-happy.png", 
            choices: [
            { text: "Collaborate on a revised design brief together", next: "goodEnding1" },
            { text: "Provide minimal additional details and request the poster again", next: "neutralEnding1" },
            { text: "Insist the original brief should already be enough", next: "badEnding1" }
            ]
            },

            urgentRequest: { 
            character: "Creative Director", 
            emotion: "frustrated", 
            text: "The design team needs proper direction before producing visual materials. Rushing the request without clear guidance may result in poor quality.", 
            image: "https://i.ibb.co/RpnPbpgK/driector-sad.png",
            choices: [
            { text: "Work with the Creative Director to define priorities and timeline", next: "goodEnding2" },
            { text: "Ask for a quick draft even if the brief is incomplete", next: "neutralEnding2" },
            { text: "Escalate the disagreement to management immediately", next: "badEnding2" }
            ]
            },

            bypassDirector: { 
            character: "Designer", 
            emotion: "uneasy", 
            text: "I received the request, but normally all creative work must go through the Creative Director for approval.", 
            image: "https://i.ibb.co/HLY4Ysvm/designer-sad.png",
            choices: [
            { text: "Return to the Creative Director to align properly", next: "neutralEnding3" },
            { text: "Ask the designer to finish the poster quietly", next: "badEnding3" },
            { text: "Ignore the creative workflow and proceed anyway", next: "badEnding4" }
            ]
            },

            goodEnding1: { 
            character: "Creative Director", 
            emotion: "relieved", 
            text: "With the updated brief and clear messaging, the design team produced a strong poster aligned with the campaign goals.", 
            image: "https://i.ibb.co/nNBC069L/director-happy.png", 
            ending: "GOOD ENDING — Effective Creative Collaboration", 
            learning: "Clear design briefs and collaboration between PCC and Creative teams lead to better campaign results." 
            },

            neutralEnding1: { 
            character: "Designer", 
            emotion: "uncertain", 
            text: "The poster was produced but required multiple revisions because the direction remained unclear.", 
            image: "https://i.ibb.co/2141PTfh/designer-neutral.png", 
            ending: "NEUTRAL ENDING — Multiple Revisions", 
            learning: "Incomplete briefs often result in repeated design revisions and slower production." 
            },

            badEnding1: { 
            character: "Creative Director", 
            emotion: "frustrated", 
            text: "Without a clear brief, the creative team paused the request to avoid producing misaligned materials.", 
            image: "https://i.ibb.co/RpnPbpgK/driector-sad.png",
            ending: "BAD ENDING — Campaign Delay", 
            learning: "Creative teams need clear direction to produce effective materials." 
            },

            goodEnding2: { 
            character: "Creative Director", 
            emotion: "focused", 
            text: "After aligning priorities and timeline, the design team produced a campaign-ready poster on schedule.", 
            image: "https://i.ibb.co/nNBC069L/director-happy.png", 
            ending: "GOOD ENDING — Coordinated Campaign Delivery", 
            learning: "Proper communication between operations and creative teams ensures both quality and timely delivery." 
            },

            neutralEnding2: { 
            character: "Designer", 
            emotion: "busy", 
            text: "A quick draft was produced but required significant adjustments later.", 
            image: "https://i.ibb.co/HLY4Ysvm/designer-sad.png",
            ending: "NEUTRAL ENDING — Draft Rework", 
            learning: "Quick drafts without direction can help temporarily but may increase revision workload." 
            },

            badEnding2: { 
            character: "HR Management", 
            emotion: "concerned", 
            text: "Escalating prematurely created unnecessary tension between departments.", 
            image: "https://i.ibb.co/k6zXNnzp/hr-sad.png",
            ending: "BAD ENDING — Department Conflict", 
            learning: "Operational disagreements should first be addressed through direct collaboration." 
            },

            neutralEnding3: { 
            character: "Creative Director", 
            emotion: "calm", 
            text: "Thanks for aligning with the proper workflow. Let's review the request together.", 
            image: "https://i.ibb.co/gZk50KjH/driector-neutral.png",
            ending: "NEUTRAL ENDING — Workflow Restored", 
            learning: "Following established creative processes prevents confusion and delays." 
            },

            badEnding3: { 
            character: "Creative Director", 
            emotion: "frustrated", 
            text: "Bypassing approval caused confusion and forced the design to be redone.", 
            image: "https://i.ibb.co/RpnPbpgK/driector-sad.png",
            ending: "BAD ENDING — Design Rejected", 
            learning: "Ignoring approval workflows can lead to wasted effort and conflict." 
            },

            badEnding4: { 
            character: "Creative Director", 
            emotion: "angry", 
            text: "Ignoring the creative approval process caused a serious internal conflict between departments.", 
            image: "https://i.ibb.co/RpnPbpgK/driector-sad.png",
            ending: "BAD ENDING — Workflow Breakdown", 
            learning: "Respecting creative leadership and workflow ensures efficient collaboration." 
            }
    }},
    internal_conflict_hr: { 
        title: "Internal Team Conflict Requiring HR Support", 
        start: "start", 
        music: "https://blueoceancrew.net/VN-BGM/internal_conflict.mp3",

        nodes: {

        start: { 
        character: "Community Manager", 
        emotion: "concerned", 
        text: "I've noticed tension between two team members during operations coordination. Discussions about delayed tasks have turned into arguments in team channels, and it's starting to affect productivity.", 
        image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png", 
        choices: [
        { text: "Speak privately with both team members to understand the issue", next: "investigateConflict" },
        { text: "Escalate the situation directly to HR", next: "directHR" },
        { text: "Ignore the conflict and hope it resolves on its own", next: "ignoreConflict" }
        ] 
        },

            investigateConflict: { 
            character: "Community Manager", 
            emotion: "focused", 
            text: "After speaking with both team members separately, it appears the disagreement stems from unclear task responsibilities and communication misunderstandings.", 
            image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png", 
            choices: [
            { text: "Mediate the discussion and clarify responsibilities", next: "neutralEnding1" },
            { text: "Document the issue and escalate it to HR for guidance", next: "goodEnding1" },
            { text: "Tell both members to resolve the issue themselves", next: "badEnding1" }
            ]
            },

            directHR: { 
            character: "Community Manager", 
            emotion: "alert", 
            text: "I've reported the situation to HR and explained how the conflict is affecting the team's operations.", 
            image: "https://i.ibb.co/ds87nt9t/comm-manager-neutral.png", 
            choices: [
            { text: "Provide HR with documented evidence and communication logs", next: "goodEnding2" },
            { text: "Give HR only a brief summary without details", next: "neutralEnding2" },
            { text: "Stop monitoring the situation after reporting", next: "badEnding2" }
            ]
            },

            ignoreConflict: { 
            character: "Community Manager", 
            emotion: "uncertain", 
            text: "The conflict continues to grow. Other team members are starting to feel uncomfortable during discussions.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            choices: [
            { text: "Address the issue now and escalate to HR", next: "neutralEnding3" },
            { text: "Warn the team to stop arguing publicly", next: "badEnding3" },
            { text: "Continue ignoring the issue", next: "badEnding4" }
            ]
            },

            goodEnding1: { 
            character: "HR Manager", 
            emotion: "supportive", 
            text: "HR reviewed the documented concerns and helped mediate the conflict, establishing clearer communication guidelines and responsibilities.", 
            image: "https://i.ibb.co/NgdwQ0Ph/hr-happy.png",
            ending: "GOOD ENDING — Healthy Team Resolution", 
            learning: "Documenting concerns and involving HR when necessary promotes professional conflict resolution." 
            },

            neutralEnding1: { 
            character: "Community Manager", 
            emotion: "relieved", 
            text: "The discussion helped clarify some misunderstandings, but the underlying tension between team members still exists.", 
            image: "https://i.ibb.co/rK4qnbNj/comm-manager-happy.png",
            ending: "NEUTRAL ENDING — Temporary Resolution", 
            learning: "Mediation can help resolve issues, but persistent conflicts may still require HR guidance." 
            },

            badEnding1: { 
            character: "Community Manager", 
            emotion: "frustrated", 
            text: "Without guidance, the disagreement escalated further and disrupted team collaboration.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            ending: "BAD ENDING — Escalating Workplace Conflict", 
            learning: "Serious internal conflicts should not be left unresolved without proper support." 
            },

            goodEnding2: { 
            character: "HR Manager", 
            emotion: "focused", 
            text: "With detailed documentation, HR quickly understood the situation and facilitated a structured conflict resolution process.", 
            image: "https://i.ibb.co/NgdwQ0Ph/hr-happy.png",
            ending: "GOOD ENDING — Effective HR Intervention", 
            learning: "Providing clear documentation helps HR resolve workplace conflicts efficiently." 
            },

            neutralEnding2: { 
            character: "HR Manager", 
            emotion: "concerned", 
            text: "HR needed additional information before taking action, delaying the resolution process.", 
            image: "https://i.ibb.co/dsKNV7rP/hr-neutral.png",
            ending: "NEUTRAL ENDING — Delayed HR Response", 
            learning: "Escalating conflicts without context can slow HR’s ability to help." 
            },

            badEnding2: { 
            character: "Community Manager", 
            emotion: "worried", 
            text: "Because the situation wasn't monitored after reporting, the conflict continued affecting team productivity.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            ending: "BAD ENDING — Ongoing Workplace Tension", 
            learning: "Escalation should be followed by active monitoring and support." 
            },

            neutralEnding3: { 
            character: "HR Manager", 
            emotion: "focused", 
            text: "HR eventually stepped in to mediate the issue, but the delay allowed tension to affect team morale.", 
            image: "https://i.ibb.co/dsKNV7rP/hr-neutral.png",
            ending: "NEUTRAL ENDING — Late Intervention", 
            learning: "Addressing internal conflicts early prevents larger workplace disruptions." 
            },

            badEnding3: { 
            character: "Community Manager", 
            emotion: "disappointed", 
            text: "Public warnings did not resolve the issue, and team members felt uncomfortable sharing concerns.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            ending: "BAD ENDING — Poor Team Morale", 
            learning: "Suppressing conflict without addressing root causes can harm team morale." 
            },

            badEnding4: { 
            character: "Community Manager", 
            emotion: "overwhelmed", 
            text: "Ignoring the conflict allowed it to escalate into a serious workplace dispute requiring formal HR investigation.", 
            image: "https://i.ibb.co/0yYCcpPD/comm-manager-sad.png",
            ending: "BAD ENDING — Formal HR Disciplinary Case", 
            learning: "Unresolved internal conflicts can escalate into serious HR cases if ignored." 
            }
    }},
    cybersecurity_threat: { 
        title: "Potential Cybersecurity Threat", 
        start: "start", 
        music: "https://blueoceancrew.net/VN-BGM/cybersecurity.mp3",

        nodes: {

        start: { 
        character: "Program Community Coordinator", 
        emotion: "concerned", 
        text: "Several users reported receiving strange login alerts and suspicious emails asking them to verify their accounts. Some also noticed unusual activity in their dashboards. This could be a cybersecurity issue.", 
        image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
        choices: [
        { text: "Collect reports and escalate to IT Security immediately", next: "escalateSecurity" },
        { text: "Warn users about possible phishing attempts", next: "warnUsers" },
        { text: "Assume it's isolated user error and monitor the situation", next: "monitorThreat" }
        ] 
        },

            escalateSecurity: { 
            character: "Program Community Coordinator", 
            emotion: "focused", 
            text: "I gathered screenshots of suspicious emails and login alerts. I'm preparing an internal ticket for the IT Security team with detailed evidence.", 
            image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png",
            choices: [
            { text: "Escalate the incident as a potential phishing attack", next: "goodEnding1" },
            { text: "Submit the ticket without detailed evidence", next: "neutralEnding1" },
            { text: "Delay escalation until more users report the issue", next: "badEnding1" }
            ]
            },

            warnUsers: { 
            character: "Program Community Coordinator", 
            emotion: "alert", 
            text: "I posted a warning reminding users not to click suspicious links and to report unusual login alerts. Users are thankful but concerned about platform safety.", 
            image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png",
            choices: [
            { text: "Coordinate with IT Security while continuing to monitor", next: "goodEnding2" },
            { text: "Let users report issues individually to IT", next: "neutralEnding2" },
            { text: "Assume the warning is enough and stop monitoring", next: "badEnding2" }
            ]
            },

            monitorThreat: { 
            character: "Program Community Coordinator", 
            emotion: "uncertain", 
            text: "More reports are coming in. Some users claim their accounts attempted logins from unfamiliar locations.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            choices: [
            { text: "Escalate the situation to IT Security immediately", next: "neutralEnding3" },
            { text: "Ignore reports assuming they are false alarms", next: "badEnding3" },
            { text: "Continue monitoring without escalation", next: "badEnding4" }
            ]
            },

            goodEnding1: { 
            character: "IT Security Analyst", 
            emotion: "focused", 
            text: "The evidence confirmed a phishing campaign targeting platform users. We blocked malicious domains, secured affected accounts, and implemented additional monitoring.", 
            image: "https://i.ibb.co/CZfJgLx/analyst-happy.png",
            ending: "GOOD ENDING — Threat Contained Quickly", 
            learning: "Prompt escalation with evidence helps security teams contain threats before they escalate." 
            },

            neutralEnding1: { 
            character: "IT Security Analyst", 
            emotion: "busy", 
            text: "The ticket was reviewed, but limited details delayed investigation. The phishing attempt was eventually blocked after several reports.", 
            image: "https://i.ibb.co/G39xjcsK/analyst-neutral.png",
            ending: "NEUTRAL ENDING — Delayed Investigation", 
            learning: "Providing detailed evidence during escalation accelerates cybersecurity response." 
            },

            badEnding1: { 
            character: "IT Security Analyst", 
            emotion: "frustrated", 
            text: "Because the threat was reported late, several users had already interacted with the malicious links before the attack was stopped.", 
            image: "https://i.ibb.co/Kxn9vGkM/analyst-sad.png",
            ending: "BAD ENDING — Compromised Accounts", 
            learning: "Delaying escalation during potential cybersecurity threats increases the risk of user compromise." 
            },

            goodEnding2: { 
            character: "IT Security Analyst", 
            emotion: "relieved", 
            text: "By warning users and coordinating with IT Security, the team quickly identified and blocked the phishing source before major damage occurred.", 
            image: "https://i.ibb.co/CZfJgLx/analyst-happy.png",
            ending: "GOOD ENDING — Preventive Action", 
            learning: "User awareness combined with security escalation is an effective defense against cyber threats." 
            },

            neutralEnding2: { 
            character: "Program Community Coordinator", 
            emotion: "concerned", 
            text: "Users submitted multiple reports individually, which slowed down IT Security’s investigation.", 
            image: "https://i.ibb.co/Hp9nxJy2/pcc-neutral.png", 
            ending: "NEUTRAL ENDING — Fragmented Reports", 
            learning: "Centralized escalation through Program Community Coordinator helps security teams identify threats faster." 
            },

            badEnding2: { 
            character: "Program Community Coordinator", 
            emotion: "worried", 
            text: "Without further monitoring, the phishing attack continued targeting users before IT noticed the pattern.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "BAD ENDING — Uncontrolled Phishing Campaign", 
            learning: "Warnings alone are not enough—continuous monitoring and escalation are required." 
            },

            neutralEnding3: { 
            character: "IT Security Analyst", 
            emotion: "focused", 
            text: "Late escalation allowed the security team to mitigate the threat, but several users experienced suspicious login attempts.", 
            image: "https://i.ibb.co/G39xjcsK/analyst-neutral.png",
            ending: "NEUTRAL ENDING — Late Mitigation", 
            learning: "Early escalation is key in cybersecurity incidents." 
            },

            badEnding3: { 
            character: "Program Community Coordinator", 
            emotion: "shocked", 
            text: "Ignoring the reports allowed attackers to continue targeting users, resulting in compromised accounts.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "BAD ENDING — Security Breach", 
            learning: "Cybersecurity warnings should always be taken seriously and escalated immediately." 
            },

            badEnding4: { 
            character: "Program Community Coordinator", 
            emotion: "overwhelmed", 
            text: "The threat escalated into a full security incident affecting multiple user accounts, forcing emergency intervention from the IT Security team.", 
            image: "https://i.ibb.co/s7h1KXH/pcc-sad.png",
            ending: "BAD ENDING — Major Security Incident", 
            learning: "Failing to act quickly during potential cyber threats can lead to large-scale security breaches." 
            }
    }}
};



function getEmotionSettings(emotion) {
  switch (emotion) {
    case "angry": return { pitch: 1.0, rate: 0.9, volume: 1 };
    case "frustrated": return { pitch: 0.9, rate: 1.1, volume: 1 };
    case "annoyed": return { pitch: 0.95, rate: 1.05, volume: 1 };
    case "calm": return { pitch: 1.1, rate: 0.9, volume: 1 };
    case "happy": return { pitch: 1.25, rate: 1, volume: 1 };
    case "uncertain": return { pitch: 1.05, rate: 0.95, volume: 0.95 };
    default: return { pitch: 1, rate: 1, volume: 1 };
  }
}

// Voice assignment per character
const characterVoiceProfiles = {
  "Customer": { preferred: ["Microsoft Mark", "Google UK English Male"], pitch: 1.2, rate: 1.05 },
  "Support Agent": { preferred: ["Google UK English Male", "Microsoft David", "Daniel"], pitch: 1.2, rate: 1.05 },
  "Rewards Officer": { preferred: ["Google UK English Male","Sean"], pitch: 1.05, rate: 0.95 },
  "Community Manager": { preferred: ["Google UK English Female","Microsoft Jenny"], pitch: 1.1, rate: 1.0 },
  "Operations Manager": { preferred: ["Google UK English Female","Microsoft Jenny"], pitch: 1.1, rate: 1.0 },
  "Technical Team": { preferred: ["Microsoft Mark", "Microsoft David"], pitch: 0.95, rate: 0.9 },
  "Technical Support": { preferred: ["Microsoft Guy", "Microsoft David"], pitch: 0.95, rate: 0.9 },
  "IT Engineer": { preferred: ["Google UK English Male", "Microsoft David", "Daniel"], pitch: 1.2, rate: 1.05 },
  "Operations": { preferred: ["Microsoft David", "Daniel"], pitch: 0.95, rate: 0.95 },
  "Program Community Coordinator": { preferred: ["Microsoft Zira"], pitch: 0.95, rate: 0.95 },
  "HR Manager": { preferred: ["Google UK English Female","Microsoft Jenny"], pitch: 1.1, rate: 1.0 },
};

function findVoice(preferredNames, voices) {
  for (let name of preferredNames) {
    const v = voices.find(v => v.name.includes(name));
    if (v) return v;
  }
  return voices[0];
}

function speak(text, emotion, character, onEnd) {
  if (!window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();

  const profile = characterVoiceProfiles[character] || {
    preferred: [],
    pitch: 1,
    rate: 1
  };

  const utter = new SpeechSynthesisUtterance(text);
  const emotionSettings = getEmotionSettings(emotion);

  utter.pitch = profile.pitch * emotionSettings.pitch;
  utter.rate = profile.rate * emotionSettings.rate;

  utter.voice = findVoice(profile.preferred, voices);

  utter.onend = () => {
    if (onEnd) onEnd();
  };
  
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function resolveRandom(outcomes = []) {
  if (!outcomes.length) return null;
  const total = outcomes.reduce((s, o) => s + (o.chance || 0), 0);
  const r = Math.random() * total;
  let cumulative = 0;
  for (let o of outcomes) {
    cumulative += o.chance;
    if (r <= cumulative) return o.next;
  }
  return outcomes[outcomes.length - 1].next;
}

export default function CustomerServiceGame() {
  const [screen, setScreen] = useState("intro");
  const [fadeOut, setFadeOut] = useState(false);
  const introVideo = useRef(null);
  const [scenarioKey, setScenarioKey] = useState(null);
  const [node, setNode] = useState(null);
  const [speechFinished, setSpeechFinished] = useState(false);
  const bgmRef = useRef(null);
  const menuBgmRef = useRef(null);
  const menuBtn = useRef(null);
  const clickSfx = useRef(null);

  const scenario = scenarioKey ? scenarios[scenarioKey] : null;
  const current = scenario && node ? scenario.nodes[node] : null;

  const [shuffledChoices, setShuffledChoices] = useState([]);

useEffect(() => {
  if (current?.choices) {
    setShuffledChoices(shuffleArray(current.choices));
  }
}, [node]);  

  const retryScenario = () => {
       setNode(scenario.start);

  const startNode = scenarios[scenarioKey].nodes["start"];

  if (startNode?.choices) {
    setShuffledChoices(shuffleArray(startNode.choices));
  }
};
  
  useEffect(() => {
  const images = [];

  Object.values(scenarios).forEach(s => {
    Object.values(s.nodes).forEach(n => {
      if (n.image) images.push(n.image);
    });
  });

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

}, []);

  useEffect(() => {
  const sounds = [
    "https://clubunited.ph/wrapup/product.mp3",
    "https://clubunited.ph/wrapup/rewards.mp3",
    "https://clubunited.ph/wrapup/platform.mp3",
    "https://clubunited.ph/wrapup/menu_start.mp3",
    "https://clubunited.ph/wrapup/scenetitle.mp3"
  ];

  sounds.forEach(src => {
    const audio = new Audio();
    audio.src = src;
  });

}, []);

  const skipIntro = () => {
  if (introVideo.current) {
    introVideo.current.pause();
    introVideo.current.currentTime = 0;
  }

    setFadeOut(true);

  setTimeout(() => {
  setScreen("menu");
}, 700);
};  
  useEffect(() => {

     if (screen === 'game' && scenario?.music && bgmRef.current) {
    bgmRef.current.src = scenario.music;
    bgmRef.current.volume = 0.30;
    bgmRef.current.loop = true;
    bgmRef.current.currentTime = 0;
    bgmRef.current.play().catch(() => {});
  }
}, [screen, scenarioKey]);
    

  useEffect(() => {
    if (menuBtn.current) {
    menuBtn.current.volume = 1;
    menuBtn.current.loop = false;   
    menuBtn.current.play().catch(() => {});
    }
    
    if (menuBgmRef.current) {
    menuBgmRef.current.volume = 0.8;
    menuBgmRef.current.loop = false;   
    menuBgmRef.current.play().catch(() => {});
    }
    
    if (screen === "menu" && menuBgmRef.current) {
      menuBgmRef.current.volume = 0.8;
      menuBgmRef.current.loop = false;
      menuBgmRef.current.play().catch(() => {});
    }

    if (screen !== "menu" && menuBgmRef.current) {
      menuBgmRef.current.pause();
      menuBgmRef.current.currentTime = 0;
    }
    
     if (screen === "title" && menuBgmRef.current) {
      menuBgmRef.current.volume = 1;
      menuBgmRef.current.loop = false;
      menuBgmRef.current.play().catch(() => {});
    }
     
  }, [screen]);

  useEffect(() => {

    const voices = window.speechSynthesis.getVoices();
  
    if (!voices.length) return;

   
    if (!current?.text) return;
    setSpeechFinished(false);
    const delay = setTimeout(() => {
      speak(current.text, current.emotion, current.character, () => setSpeechFinished(true));
    }, 600);
    return () => clearTimeout(delay);
  }, [node]);

  function playClick() { if (clickSfx.current) { clickSfx.current.currentTime = 0; clickSfx.current.play().catch(() => {}); } }
  function startScenario(key) {
  playClick();
  setScenarioKey(key);
  setNode(null);
  setScreen("title");
}
  function backToMenu() { playClick(); if (bgmRef.current) bgmRef.current.pause(); setScreen("menu"); setScenarioKey(null); setNode(null); }
  function goNextRandom() { if (!current?.randomOutcomes) return; setTimeout(() => setNode(resolveRandom(current.randomOutcomes)), 700); }
  function toggleMusic() { if (bgmRef.current) bgmRef.current.pause(); }

  const startSound = useRef(null);
  
const startMenuBtn = () => {
  if (menuBtn.current) {
    menuBtn.current.currentTime = 0;
    menuBtn.current.volume = 1;
    menuBtn.current.play().catch(() => {});
  }
};

const startGame = () => {
  if (startSound.current) {
    startSound.current.currentTime = 0;
    startSound.current.play().catch(() => {});
  }
};

    
    useEffect(() => {
      if (startSound.current) {
        startSound.current.play().catch(() => {});
      }
    }, []);

  if (screen === "intro") return (
  
 <div className="bg-black absolute top-0 left-0 w-screen h-full overflow-y-auto z-20">
<div
    className={`h-screen bg-black flex items-center justify-center transition-opacity duration-700 ${
      fadeOut ? "opacity-0" : "opacity-100"
    }`}
  >

    <video
      ref={introVideo}
      controls
      autoPlay
      playsInline
      className="h-screen w-auto max-w-none"
      onEnded={() => {
    setTimeout(() => {
      skipIntro();
    }, 2000); // 2 second delay
  }}
    >
      <source
        src="https://clubunited.ph/wrapup/wrapup-intro.mp4"
        type="video/mp4"
      />
    </video>

    <button
      onClick={skipIntro}
      className="absolute bottom-10 right-10 text-black bg-white/80 px-5 py-2 rounded hover:bg-white"
    >
      Skip
    </button>

  </div>
</div>
);

  
  if (screen === "menu") return (

    
  
    <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://clubunited.ph/wrapup/main_scene.mp4" type="video/mp4" />
      </video>
           
      
      <audio ref={menuBgmRef} src="https://clubunited.ph/wrapup/menu_start.mp3" preload="auto"/>
      <audio ref={menuBtn} src="https://clubunited.ph/wrapup/btn_hover.mp3" preload="auto"/>
      
      <audio ref={clickSfx} src="/audio/click.mp3" preload="auto" />
      
      <div className="p-6 bg-black/60 space-y-4 absolute top-0 left-0 w-screen h-full overflow-y-auto z-20">
       
        <div className="p-6 space-y-4 absolute right-0 top-0 h-full w-3/4 z-20 relative z-10 mx-auto">
        <img src="https://clubunited.ph/wrapup/wellatsea-visual-novel.png" width="500" className="mx-auto block" />
        <h1 className="text-2xl font-bold text-center text-white">WellAtSea Visual Novel Simulator</h1>
        <p className="text-center">Select a scenario:</p>
        {Object.entries(scenarios).map(([key, s]) => (
          <button 
            key={key} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded" 
            onClick={() => { 
              startGame();
              startScenario(key);  
            }} 
            onMouseEnter={() => startMenuBtn()} // now correctly wrapped
          >
            {s.title}
          </button>
        ))}
        </div>  
      </div>
    </div>
  );

  if (screen === "title" && scenario) {
  return (

  <div className="w-full h-screen flex items-center justify-center bg-black text-white"> 
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <audio ref={menuBgmRef} src="https://clubunited.ph/wrapup/scenetitle.mp3" preload="auto" autoPlay/>
      <h1 className="text-4xl font-bold mb-4 text-white">{scenario.title}</h1>
      <p className="text-gray-300 mb-8">Prepare to handle this situation.</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded"
        onClick={() => {
          playClick();
          setNode(scenario.start);
          setScreen("game");
        }}
      >
        ▶ Next
      </button>
    </div>
</div>
  );
}

if (!current) return null;

  return (
  <div className="w-full h-screen relative overflow-hidden bg-white">
   {/* Back to Menu */}
    <button
      onClick={() => { playClick(); backToMenu(); }}
      className="absolute top-4 left-4 z-30 bg-black/60 text-white px-3 py-2 rounded hover:bg-black/80 text-sm"
    >
      ⬅ Back to Menu
    </button>
    <button onClick={toggleMusic} className="absolute top-4 right-4 z-30 bg-black/60 text-white px-3 py-2 rounded hover:bg-black/80 text-white rounded text-sm">
          🔇 Music Off
        </button>
    <audio ref={bgmRef} />
    <audio ref={clickSfx} src="/audio/click.mp3" preload="auto" />

    {current.image && (
      <motion.img
        key={current.image}
        src={current.image}
        alt={`${current.character} ${current.emotion}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 w-full h-full object-contain object-top z-10"
      />
    )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-4xl w-full bg-black/70 p-6 rounded-lg space-y-4">
        <div className="text-lg font-semibold text-white">{current.character} ({current.emotion})</div>
        <div className="text-white text-lg">{current?.text}</div>
        <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 mx-2 px-3 rounded text-sm" onClick={() => { playClick(); speak(current?.text, current.emotion, current.character); }}>Replay Voice</button>
        
        {current?.choices && !current?.ending && (
          <div className="flex flex-col gap-2 mt-4">
          
            {current?.choices &&
              shuffledChoices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => { playClick(); setNode(choice.next); }}
                  className="w-full bg-green-600 hover:bg-green-700 p-3 rounded"
                >
                  {choice.text}
                </button>
            ))}
          </div>
        )}
        {current?.randomOutcomes && speechFinished && !current?.ending && (
          <div className="mt-4"><button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded" onClick={() => { playClick(); goNextRandom(); }}>▶ Continue</button></div>
        )}
        {current?.ending && (
          <div className="space-y-3 mt-4">
            <div className="font-bold text-green-400 text-xl">{current.ending}</div>
            <div className="bg-slate-800 p-3 rounded text-white">
              <strong>Learning Insight:</strong>
              <p>{current.learning}</p>
            </div>
            <button
              onClick={retryScenario}
              className="m-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
            >
              Retry Scenario
            </button>
            <button className="m-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={() => { playClick(); backToMenu(); }}>Return to Scenario Menu</button>
          </div>
        )}
      </div>
    </div>
  );
}
