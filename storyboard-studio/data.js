/* Storyboard Studio starter content.
   Boards here are the starting templates. Once edited, the saved copy wins. */

/* Gimbal library: text and clips carried over from Shot Commander (13 moves). */
const MOVES = [
  {id:0,name:'Locked off',lens:'Any',mode:'Tripod',hard:1,tech:'Camera on sticks, nothing moves. Let the talent do the work.',mistake:'Leaving it crooked. Level the horizon before the take.',tip:'Use it for the longest lines, where a move would distract from the words.'},
  {id:1,name:'Straight Push',lens:'Wide',mode:'Standard',hard:1,tech:'Ninja walk: smooth forward or backward motion keeping grid lines aligned with room lines.',mistake:'Letting hips sway side to side breaks the smooth glide and makes the footage look shaky.',tip:"Use the center X on your grid overlay to anchor where you want the viewer's eye to go.",op:'clips/01_straight_push_operator.mp4',res:'clips/01_straight_push_result.mp4'},
  {id:2,name:'Push Curve',lens:'Wide',mode:'Standard',hard:2,tech:'Push in straight, then introduce a gentle wrist turn. Let the gimbal curve, not your body.',mistake:'Twisting your whole torso creates a harsh 90° snap instead of a smooth, cinematic arc.',tip:'The curve should feel like water flowing, started by the fingertips, not the shoulders.',op:'clips/02_push_curve_operator.mp4',res:'clips/02_push_curve_result.mp4'},
  {id:3,name:'Orbit',lens:'Wide',mode:'Standard',hard:2,tech:"Move your feet in a 'C' shape (bird's eye) while spinning and gently turning your wrist.",mistake:'Moving too fast loses the smooth orbit and creates a panning clip instead of a true orbit.',tip:'Meshes naturally with other clips in the edit. Shows all four sides of the subject.',res:'clips/03_orbit_result.mp4'},
  {id:4,name:'Yee-Haw Drop',lens:'Wide',mode:'PTF',hard:2,tech:'PTF mode: joystick up, reach wide, drop the camera all the way down your legs.',mistake:'Not going wide enough with your reach limits the dramatic drop effect.',tip:'Wide reach plus full drop creates the cowboy-style height reveal. Commit to the full range.',op:'clips/04_yeehaw_drop_operator.mp4'},
  {id:5,name:'FPV',lens:'Wide',mode:'Follow',hard:3,tech:'Mimic a flying drone: energetic, swooping movement through the space.',mistake:'Overusing FPV kills its impact. One or two per video maximum.',tip:'Best in modern homes with reflections and great light. Avoid in traditional or dark spaces.',res:'clips/05_fpv_result.mp4'},
  {id:6,name:'PTF Rise & Drop',lens:'Wide',mode:'PTF',hard:3,tech:'Walk in straight, push up with wrist showing height, orbit if possible, then drop.',mistake:'Forgetting the orbit makes this just a rise. The orbit is what makes it special.',tip:'Works beautifully around a staircase. Orbit the newel post while changing elevation.',op:'clips/06_ptf_rise_drop_operator.mp4',res:'clips/06_ptf_rise_drop_result.mp4'},
  {id:7,name:'Push + Rise',lens:'Wide',mode:'PTF',hard:2,tech:'PTF mode: move in straight while lifting the camera upward at the same time.',mistake:'Tilting the camera down as you rise. Keep framing level while the camera lifts.',tip:'Great for revealing tall ceilings or dramatic height from a low start.',op:'clips/07_push_rise_operator.mp4'},
  {id:8,name:'Tripod',lens:'Wide',mode:'Tripod',hard:1,tech:'Mount perfectly squared on tripod, execute a subtle zoom-out. Camera is stationary.',mistake:'Not squaring up to the room. Even 1° of tilt shows on the horizontal lines.',tip:'Use for artwork and textures (backsplash, wood grain, stone).'},
  {id:9,name:'Detailed Orbit',lens:'50mm',mode:'Standard',hard:2,tech:'Brace body, springload the wrist, orbit the subject while rising and dropping.',mistake:'Not springloading the wrist causes jerky movement. Pre-tension is key.',tip:'Reach all the way up first, then let the drop happen naturally. Gravity helps.',op:'clips/09_detailed_orbit_operator.mp4',res:'clips/09_detailed_orbit_result.mp4'},
  {id:10,name:'Cowboy Lift',lens:'50mm',mode:'PTF',hard:3,tech:'Hold a center focus point, orbit around it, lift via PTF with foreground top and bottom.',mistake:'Losing the center focal point during the orbit. The subject must stay perfectly centered.',tip:'Foreground at the start and end of the lift gives this shot its cinematic feel.',op:'clips/10_cowboy_lift_operator.mp4',res:'clips/10_cowboy_lift_result.mp4'},
  {id:11,name:'Detail Slider',lens:'50mm',mode:'Standard',hard:2,tech:'Slide laterally with a slight drop, keeping all horizontal lines perfectly even.',mistake:'Letting the camera tilt. Ovens, cabinets and range hoods must stay perfectly horizontal.',tip:'Slow and deliberate wins every time.',op:'clips/11_slider_operator.mp4',res:'clips/11_slider_result.mp4'},
  {id:12,name:'PTF Orbit',lens:'50mm f/1.4',mode:'PTF',hard:3,tech:'Position above the subject, wrap around it, move upward keeping the subject centered.',mistake:'Losing center alignment. The subject must not drift. Hardest shot to execute.',tip:'Changing foreground and background layers create the look. f/1.4 for max bokeh.',op:'clips/12_ptf_orbit_operator.mp4',res:'clips/12_ptf_orbit_result.mp4'},
  {id:13,name:'Top Down Detail',lens:'50mm',mode:'Standard',hard:2,tech:'Point camera straight down at the detail, pull backward while tilting the camera upward.',mistake:'Not including a foreground element at the end. That is what makes the shot look special.',tip:'End on a foreground element for a natural, elegant stopping point.',op:'clips/13_top_down_operator.mp4'},
  {id:14,name:'Drone',lens:'Drone',mode:'Mavic 3',hard:2,tech:'Set the move before you hit record, then one slow, committed pass.',mistake:'Adjusting two sticks halfway through. Plan the line, then fly it.',tip:'Drone works best as an act break, not filler.'},
  {id:15,name:'The Hurley Special',lens:'Wide',mode:'PTF (confirm)',hard:3,tech:'Reverse parallel park. Start close with the gimbal at head height, camera up at the ceiling. Walk backward around the corner of the island, twisting the camera down as you sink into a squat. Land low, level and wide.',mistake:'Landing tilted up or down. The final frame must be level, or the whole move falls apart.',tip:'Walk the path first so you know where the island corner is. Operator clip runs at 75% speed.',op:'clips/15_hurley_special_operator.mp4',res:'clips/15_hurley_special_result.mp4'}
  ,{id:16,name:'Detail Slider Rise',lens:'50mm',mode:'Standard',hard:2,tech:'Slide sideways and slowly lift the camera at the same time, keeping every horizontal line level.',mistake:'Tilting as you rise. Keep the camera level and let the height change do the work.',tip:'Michael uses this a lot on family room details: coffee table, shelves, the mantel. Clips coming later.'}
  ,{id:17,name:'Dive Reveal',lens:'Drone',mode:'Mavic 3',hard:2,tech:'Start high on the horizon. Fly forward and tilt the camera down at the same time, so you finish straight above the house.',mistake:'Tilting faster than you fly. The house should arrive at the centre just as the camera hits straight down.',tip:'Best as the opener. The neighbourhood first, then the house fills the frame.',res:'clips/17_dive_reveal_result.mp4',op:'clips/17_dive_reveal_operator.mp4'}
  ,{id:18,name:'Spin Drop',lens:'Drone',mode:'Mavic 3',hard:3,tech:'Camera straight down over the roof. Drop down and spin (yaw) at the same time, keeping the house in the centre.',mistake:'Drifting sideways while you spin. The roof has to stay dead centre or it looks messy.',tip:'Fast and short. Great as a transition between the dive and the top-down.',res:'clips/18_spin_drop_result.mp4',op:'clips/18_spin_drop_operator.mp4'}
  ,{id:19,name:'Rise & Reveal',lens:'Drone',mode:'Mavic 3',hard:2,tech:'Start low, camera straight down over the pool. Rise straight up, then fly backward and tilt the camera up until the horizon shows.',mistake:'Starting the tilt too early. Get the height first, then reveal the horizon.',tip:'Use it as the closing shot. It pulls back from the house to the whole neighbourhood.',res:'clips/19_rise_reveal_result.mp4',op:'clips/19_rise_reveal_operator.mp4'}
  ,{id:20,name:'Kitchen Orbit',lens:'Wide',mode:'Standard',hard:3,tech:'Walk the length of the island in an arc while turning the gimbal to keep the island in frame, so the camera swings around it from the end to the side.',mistake:'Walking straight and only panning. Your feet do the orbit, the gimbal just keeps the island centred.',tip:'Michael\'s kitchen orbit (the Boss Level move). Use it for the kitchen only. Other rooms keep the regular Orbit.',res:'clips/20_kitchen_orbit_result.mp4',op:'clips/20_kitchen_orbit_operator.mp4'}
];

const KINDS = {
  wide:{label:'Wide',c:'#4d9be6'}, medium:{label:'Medium',c:'#35c2b1'}, closeup:{label:'Close-up',c:'#f2c230'},
  burst:{label:'0.5s burst',c:'#9fd3f7'}, drone:{label:'Drone',c:'#46c46f'}, hero:{label:'Wide · Hero',c:'linear-gradient(90deg,#4d9be6 0 72%,#ef4b43 72% 100%)'}, graphic:{label:'Graphic only',c:'#98a6b5'}
};

const CATEGORIES = [
  {id:'commercials',name:'Commercials'},
  {id:'houses',name:'Regular houses',parent:'Real estate videos'},
  {id:'condos',name:'Condos',parent:'Real estate videos'},
  {id:'luxury',name:'Luxury',parent:'Real estate videos'},
  {id:'realtor',name:'Realtor shots'}
];

const SEED_BOARDS = [
/* ---------------------------------------------------------------- */
{id:'social',cat:'commercials',group:'pinned',name:'Social Media Sells Homes',sub:'Pinned commercial 2 of 3 · Mike',status:'Script v2',target:45,outfit:'Outfit A',
 flags:['Shot 2 needs your OK that it is true. Shot 5 uses an older US stat (2020). Stats are American, so keep the source line on screen.'],
 kit:'Sony A7S III · DJI RS 4 · 24mm + 50mm · DJI wireless mic · teleprompter for seated lines',
 combos:{
  A:{name:'Terrace walk-in into orbit',why:'One continuous feel: Mike walks into frame, the camera ramps and swings around him as the pills start to orbit.',handoff:'Keep walking speed the same at the end of clip 1 and the start of clip 2. Both move left to right.',drill:['Walk the line once with no camera','Rehearse the C-shape orbit around a chair','Shoot clip 1 at 60 fps, roll 2s past the mark','Shoot clip 2 starting from the same step','Check the handoff on the monitor before moving on'],checks:[]}
 },
 shots:[
  {id:'so1',roll:'A',kind:'medium',beat:'Hook',loc:'Living room',pos:'Standing, centre of room',dur:3,move:1,hard:1,lens:'24mm',fps:30,script:'People say you can\'t sell real estate on social media.',gfx:'"You can\'t sell" huge serif behind Mike; "social media" in accent colour.',broll:'',f:{scene:'living',talent:'m',behind:"You can't sell",bs:'serif',cap:'on *social media*'}},
  {id:'so2',roll:'A',kind:'medium',beat:'Proof',loc:'Kitchen island',pos:'Behind the island',dur:3.5,move:1,hard:1,lens:'24mm',fps:30,script:'We\'ve sold homes that started with one message on Instagram.',gfx:'Collage wall of our sold posts and reels slams in behind him.',broll:'Our real sold posts in the collage',f:{scene:'kitchen',talent:'m',el:'collage',cap:'one *message*'},notes:'Confirm this is true and name a real example for yourself before filming.'},
  {id:'so3',roll:'A',kind:'closeup',beat:'Proof',loc:'Kitchen island',pos:'Behind the island',dur:1.5,move:0,hard:1,lens:'50mm',fps:30,script:'And we\'ve got the numbers.',gfx:'"numbers" bold caps, collage fades.',broll:'',f:{scene:'kitchen',talent:'c',behind:'NUMBERS',bs:'sans'}},
  {id:'so4',roll:'A',kind:'medium',beat:'Video stat',loc:'Kitchen island',pos:'End of the island, side angle',dur:4,move:11,hard:2,lens:'50mm',fps:30,script:'39% of agents say social media brings them the most quality leads.',gfx:'Progress bar fills to 39%; 2–3 of our listing reels float in as cards. Small source line: NAR 2025.',broll:'2–3 real listing reels as floating cards',f:{scene:'kitchen',talent:'m',el:'bar',ev:'39%',cap:'most quality *leads*'},notes:'Source: NAR 2025 Technology Survey, US Realtors. Verified in the report.'},
  {id:'so5',roll:'A',kind:'medium',beat:'Seller stat',loc:'Living room',pos:'By the window',dur:4.5,move:1,hard:1,lens:'24mm',fps:30,script:'And 73% of homeowners are more likely to list with an agent who uses video.',gfx:'Giant glowing number behind his head.',broll:'',f:{scene:'living',talent:'m',behind:'73%',bs:'stat',cap:'an agent who uses *video*'},notes:'Source: NAR Broker-to-Broker article, Sept 2020, US. Older and secondary. Your call, see script note. Small source line on screen.'},
  {id:'so6',roll:'A',kind:'wide',beat:'Our reach',loc:'Terrace',pos:'Walking toward camera',dur:2.5,move:1,hard:2,lens:'24mm',fps:60,combo:'A',link:'Ramp into the orbit',script:'Over 20,000 people follow us on Instagram.',gfx:'"20,000+" counts up behind him.',broll:'',f:{scene:'terrace',talent:'w',behind:'20,000+',bs:'stat',cap:'follow *us*'},notes:'Golden hour. @soldmike had 20,911 followers on Oct 31, 2026 (Metricool). Real and provable.'},
  {id:'so7',roll:'A',kind:'hero',beat:'Our reach',loc:'Terrace',pos:'Standing, camera circles',dur:3.5,move:3,hard:3,lens:'24mm',fps:60,combo:'A',script:'That\'s exposure, demand and opportunity for our sellers.',gfx:'"Exposure · Demand · Opportunity" pill chips orbit him.',broll:'',f:{scene:'terrace',talent:'m',el:'pills',ev:'Exposure|Demand|Opportunity'}},
  {id:'so8',roll:'A',kind:'medium',beat:'Buyers',loc:'Terrace',pos:'At the railing',dur:2,move:1,hard:1,lens:'50mm',fps:30,script:'And buyers are watching too.',gfx:'"watching" italic accent.',broll:'',f:{scene:'terrace',talent:'m',cap:'buyers are *watching*'}},
  {id:'so9',roll:'B',kind:'closeup',beat:'Buyers',loc:'Terrace',pos:'Hands on phone',dur:2.5,move:9,hard:2,lens:'50mm',fps:60,script:'On Instagram, YouTube and TikTok.',gfx:'Platform logos pop in one by one.',broll:'Phone in hand scrolling our reels. Voice carries over.',f:{scene:'phone',el:'logos',ev:'IG|YT|TT'}},
  {id:'so10',roll:'A',kind:'medium',beat:'Turn',loc:'Patio',pos:'Seated',dur:4,move:1,hard:1,lens:'50mm',fps:30,script:'But here\'s the thing: views don\'t sell homes. Attention does.',gfx:'"Views" in red serif swaps to "Attention" on the beat.',broll:'',f:{scene:'patio',talent:'m',behind:'Views',bs:'serifred',cap:'*Attention* does'}},
  {id:'so11',roll:'A',kind:'medium',beat:'Craft',loc:'Patio',pos:'Seated',dur:2.5,move:0,hard:1,lens:'50mm',fps:30,script:'Grabbing someone in the first three seconds isn\'t luck.',gfx:'"isn\'t luck" bold sans.',broll:'',f:{scene:'patio',talent:'m',behind:"ISN'T LUCK",bs:'sans'}},
  {id:'so12',roll:'A',kind:'closeup',beat:'Craft',loc:'Patio',pos:'Seated, tighter',dur:2.5,move:0,hard:1,lens:'50mm',fps:30,script:'It\'s craft. And it takes practice.',gfx:'"craft." italic serif, then "practice." in accent colour.',broll:'',f:{scene:'patio',talent:'c',behind:'craft.',bs:'serif',cap:'takes *practice*'}},
  {id:'so13',roll:'A',kind:'wide',beat:'Close',loc:'Living room',pos:'Walking toward camera',dur:3,move:2,hard:2,lens:'24mm',fps:30,script:'You want an agent who gets it done, with the results to back it up?',gfx:'Sold-properties carousel starts to spin around him.',broll:'Real sold listings in the carousel',f:{scene:'living',talent:'w',el:'carousel',cap:'get the job *done*'}},
  {id:'so14',roll:'A',kind:'medium',beat:'Close',loc:'Living room',pos:'Standing, centre of room',dur:3.5,move:1,hard:1,lens:'24mm',fps:30,script:'Let\'s work together. I\'m SOLDMIKE, always on your side.',gfx:'OP Team / SoldMike logo, then "Send us a message" pill.',broll:'',f:{scene:'living',talent:'m',el:'endpill',ev:'Send us a message'}},
  {id:'so15',roll:'G',kind:'graphic',beat:'Close',loc:'Edit',pos:'',dur:2,move:0,hard:1,lens:'',fps:'',script:'',gfx:'End card: OP Team / SoldMike logo.',broll:'',f:{scene:'card'}}
 ]},
/* ---------------------------------------------------------------- */
{id:'invest',cat:'commercials',group:'pinned',name:'Your Property Deserves the Investment',sub:'Pinned commercial 3 of 3 · Mike',status:'Script v2',target:45,outfit:'Outfit B',
 flags:[],
 kit:'Sony A7S III · DJI RS 4 · 24mm + 50mm · DJI wireless mic · teleprompter for seated lines',
 combos:{
  A:{name:'Orbit into the push',why:'The camera circles Mike on "character, integrity" and ramps straight into a close push on "your family". The moment of the video.',handoff:'End the orbit facing him square, then start the push from that exact spot.',drill:['Mark the end of the orbit with tape','Rehearse the orbit around a chair','Shoot clip 1 at 60 fps, roll 2s past the mark','Start clip 2 from the tape, same height','Check the handoff on the monitor before moving on'],checks:[]}
 },
 shots:[
  {id:'in1',roll:'A',kind:'medium',beat:'Hook',loc:'Living room',pos:'Sofa, seated',dur:2,move:1,hard:1,lens:'50mm',fps:30,script:'Let me be the first to say it:',gfx:'"LET ME" big serif.',broll:'',f:{scene:'sofa',talent:'m',behind:'Let me',bs:'serif'}},
  {id:'in2',roll:'A',kind:'closeup',beat:'Hook',loc:'Living room',pos:'Sofa, seated',dur:3.5,move:0,hard:1,lens:'50mm',fps:30,script:'your property deserves the investment from your real estate agent.',gfx:'"YOUR PROPERTY" bold caps; "investment" italic in accent; "AGENT" bold.',broll:'',f:{scene:'sofa',talent:'c',behind:'YOUR PROPERTY',bs:'sans',cap:'the *investment*'}},
  {id:'in3',roll:'A',kind:'wide',beat:'Non-negotiables',loc:'Living room',pos:'Standing, walking in',dur:3,move:1,hard:2,lens:'24mm',fps:30,script:'There are things I won\'t negotiate on for my clients.',gfx:'"won\'t negotiate" serif.',broll:'',f:{scene:'living',talent:'w',cap:'*won\'t negotiate*'},notes:'Camera walks backward in front of him. Clear the path first.'},
  {id:'in4',roll:'A',kind:'closeup',beat:'Non-negotiables',loc:'Living room',pos:'Standing',dur:2,move:0,hard:1,lens:'50mm',fps:30,script:'The first one is transparency.',gfx:'"IS TRANSPARENCY." italic serif in accent colour.',broll:'',f:{scene:'living',talent:'c',cap:'is *transparency.*'}},
  {id:'in5',roll:'A',kind:'medium',beat:'Credentials',loc:'Kitchen island',pos:'Behind the island',dur:5,move:1,hard:1,lens:'24mm',fps:30,script:'I\'m a licensed broker with SRS, ABR and RENE designations, and that is not something I take lightly.',gfx:'Credential in giant glowing text; "IS NOT" with red strike-through.',broll:'',f:{scene:'kitchen',talent:'m',behind:'SRS · ABR',bs:'stat',el:'strike',ev:'IS NOT'},notes:'All three designations are on file. No years or homes-sold claim until you give me a provable number.'},
  {id:'in6',roll:'A',kind:'medium',beat:'The investment',loc:'Kitchen island',pos:'End of the island, side angle',dur:2.5,move:11,hard:2,lens:'50mm',fps:30,script:'I invest heavily in my clients\' success,',gfx:'"INVESTMENT" bold caps.',broll:'',f:{scene:'kitchen',talent:'m',behind:'INVESTMENT',bs:'sans'}},
  {id:'in7',roll:'A',kind:'closeup',beat:'The investment',loc:'Kitchen island',pos:'Behind the island',dur:2.5,move:0,hard:1,lens:'50mm',fps:30,script:'and most of it goes where you can\'t see it.',gfx:'"CAN\'T SEE" fades in.',broll:'',f:{scene:'kitchen',talent:'c',cap:'where you *can\'t see it*'}},
  {id:'in8',roll:'A',kind:'medium',beat:'What you can see',loc:'Living room',pos:'Armchair, seated',dur:3.5,move:1,hard:1,lens:'50mm',fps:30,script:'Yes, you get professional photo and video from our own media company,',gfx:'Logo chips pop in: TPM, Instagram.',broll:'',f:{scene:'armchair',talent:'m',el:'logos',ev:'TPM|IG|YT'}},
  {id:'in9',roll:'B',kind:'closeup',beat:'What you can see',loc:'Living room',pos:'Camera on the gimbal, detail',dur:2.5,move:9,hard:2,lens:'50mm',fps:60,script:'REALTOR.ca, and targeted ads.',gfx:'REALTOR.ca chip, "targeted ads" italic.',broll:'TPM behind the scenes: real camera and gimbal. Voice carries over.',f:{scene:'gear',cap:'*targeted ads*'}},
  {id:'in10',roll:'A',kind:'closeup',beat:'The work',loc:'Living room',pos:'Armchair, seated',dur:1.5,move:0,hard:1,lens:'50mm',fps:30,script:'But it\'s the work:',gfx:'"BUT" huge white sans behind him.',broll:'',f:{scene:'armchair',talent:'c',behind:'BUT',bs:'sans'}},
  {id:'in11',roll:'A',kind:'medium',beat:'The work',loc:'Living room',pos:'Armchair, seated',dur:3,move:1,hard:1,lens:'50mm',fps:30,script:'how I negotiate, and how I show up every single day.',gfx:'"work." in accent colour.',broll:'',f:{scene:'armchair',talent:'m',cap:'how I *show up*'}},
  {id:'in12',roll:'A',kind:'hero',beat:'Character',loc:'Living room',pos:'Standing, camera circles',dur:3.5,move:3,hard:3,lens:'24mm',fps:60,combo:'A',link:'Ramp into the push',script:'Because an agent\'s character, integrity and how they show up',gfx:'"Character · Integrity · How" pills orbit him.',broll:'',f:{scene:'living',talent:'m',el:'pills',ev:'Character|Integrity|How'}},
  {id:'in13',roll:'A',kind:'closeup',beat:'Character',loc:'Living room',pos:'Standing, push to close',dur:3,move:1,hard:2,lens:'50mm',fps:60,combo:'A',script:'is how they\'ll treat you and your family.',gfx:'"your family" italic accent.',broll:'',f:{scene:'living',talent:'c',cap:'you and *your family*'}},
  {id:'in14',roll:'A',kind:'medium',beat:'Close',loc:'Living room',pos:'Sofa, seated',dur:5.5,move:1,hard:1,lens:'50mm',fps:30,script:'I\'d be honoured to get to know you, whether you\'re buying, building or selling. I\'m SOLDMIKE, always on your side.',gfx:'"I would be" serif / "honoured" italic accent.',broll:'',f:{scene:'sofa',talent:'m',behind:'I would be',bs:'serif',cap:'*honoured*'}},
  {id:'in15',roll:'G',kind:'graphic',beat:'Close',loc:'Edit',pos:'',dur:2,move:0,hard:1,lens:'',fps:'',script:'',gfx:'End pill: "Send us a message" / "Link in bio" with Mike\'s photo.',broll:'',f:{scene:'card',el:'endpill',ev:'Link in bio'}}
 ]},
/* ---------------------------------------------------------------- */
{id:'homevalue',cat:'commercials',name:'Home Value Ad',sub:'Pinned commercial 1 of 3 · Nick · v15 final',status:'Finished',target:45,outfit:'',
 flags:['148 transactions and $120M still need RECO sign-off before posting.'],
 kit:'Finished video. Frames below are the real edit, for matching the other two.',combos:{},
 shots:[
  {id:'hv1',roll:'A',kind:'wide',beat:'Hook',loc:'Kitchen island',dur:5,move:0,hard:1,lens:'',fps:30,got:true,script:'Vaughan homeowners, do you actually know what your home is worth right now?',gfx:'"VAUGHAN homeowners" big text behind him.',broll:'',f:{img:'img/f1.jpg'}},
  {id:'hv2',roll:'A',kind:'medium',beat:'Hook',loc:'Kitchen island',dur:2,move:0,hard:1,lens:'',fps:30,got:true,script:'Not the online estimate.',gfx:'Glass card "Online estimate $1,249,000" with red strike.',broll:'',f:{img:'img/f2.jpg'}},
  {id:'hv3',roll:'B',kind:'drone',beat:'Problem',loc:'Property',dur:5,move:14,hard:2,lens:'Drone',fps:30,got:true,script:"Those tools don't see your basement, your lot, your renovations,",gfx:'Pills: Your basement / Your lot / Your renovations.',broll:'Three quick B-roll cuts under the pills',f:{img:'img/f3.jpg'}},
  {id:'hv4',roll:'A',kind:'medium',beat:'Problem',loc:'Kitchen island',dur:4,move:0,hard:1,lens:'',fps:30,got:true,script:'guess wrong and it can cost you tens of thousands of dollars.',gfx:'"$10,000s" red glow behind him.',broll:'',f:{img:'img/f4.jpg'}},
  {id:'hv5',roll:'A',kind:'medium',beat:'Proof',loc:'Kitchen island',dur:6,move:0,hard:1,lens:'',fps:30,got:true,script:'Results matter. This year alone, the OP Team has done 148 transactions',gfx:'SOLD reel cards orbit him.',broll:'Real sold listings in the orbit',f:{img:'img/f5.jpg'}},
  {id:'hv6',roll:'A',kind:'medium',beat:'Proof',loc:'Kitchen island',dur:3,move:0,hard:1,lens:'',fps:30,got:true,script:'and over $120 million in sales.',gfx:'Counter runs up in red glow.',broll:'',f:{img:'img/f6.jpg'}},
  {id:'hv7',roll:'A',kind:'wide',beat:'Offer',loc:'Kitchen island',dur:7,move:0,hard:1,lens:'',fps:30,got:true,script:'We offer a stress-free plan, your true market value from a team that actually delivers.',gfx:'"Stress-free plan" pill.',broll:'',f:{img:'img/f7.jpg'}},
  {id:'hv8',roll:'A',kind:'wide',beat:'Offer',loc:'Kitchen island',dur:6,move:0,hard:1,lens:'',fps:30,got:true,script:'Get a free, no obligation home evaluation with no pressure to list.',gfx:'Depth Breakdown: steps behind the speaker, room dimmed, no captions.',broll:'',f:{img:'img/f8.jpg'}},
  {id:'hv9',roll:'A',kind:'medium',beat:'Close',loc:'Kitchen island',dur:5,move:0,hard:1,lens:'',fps:30,got:true,script:'Need to sell now or are you waiting till the spring? Just tap below.',gfx:'"spring?" behind him, CTA pill.',broll:'',f:{img:'img/f9.jpg'}},
  {id:'hv10',roll:'G',kind:'graphic',beat:'Close',loc:'Edit',dur:2,move:0,hard:1,lens:'',fps:'',got:true,script:'',gfx:'White end card, OP Team logo, theopteam.ca/homeworth.',broll:'',f:{img:'img/f10.jpg'}}
 ]},
/* ---------------------------------------------------------------- */
{id:'reel',cat:'houses',family:'std',linked:true,version:'Reel',name:'Standard Listing Reel',sub:'Your 35-shot B-roll list · two-storey detached',status:'Template',target:45,outfit:'',
 flags:['Runs about 6s over the 45s B-roll target. Trim the drone finale first. The 3 agent segments (15s) are not in this list yet.','Combos are my suggestion, based on the ramp flags in your list. Change them to suit the house.'],
 kit:'Sony A7S III · DJI RS 4 · 12mm + 50mm · DJI Mavic 3',
 combos:{
  A:{name:'Through the front door',why:'The opener: exterior close-up, ramp from outside to inside, land on the door detail.',handoff:'Keep moving forward through every cut. Same height, same direction, same walking speed.',drill:['Open every door and clear the path','Walk it twice without recording','Shoot all 3 clips back to back at 60 fps','Roll 2s before and after every clip','Check exposure inside versus outside'],checks:[]},
  B:{name:'Rapid push burst',why:'Four 0.5s pushes, shown as one sliced card in your list. Close-up rule: always 1s, except this burst.',handoff:'Every push goes the same direction at the same speed, so the four clips feel like one.',drill:['Pick four details in the same room','Same lens, same height for all four','Push at the same speed each time','Roll 3s per clip, the edit uses 0.5s'],checks:[]},
  C:{name:'FPV into the money shot',why:'The hero moment: FPV with freeze and reverse, landing on the family room money shot.',handoff:'End the FPV pointing at where the money shot starts, then start from that exact spot.',drill:['Plan the FPV line through the main floor','Practise it with lights on and doors open','Shoot FPV at 120 fps for the freeze and reverse','Shoot the money shot from the landing spot','Review both on the monitor before moving on'],checks:[]},
  D:{name:'En suite reverse ramp',why:'Close-up on the en suite detail, ramping backward to reveal the room.',handoff:'Pull straight back from the same spot the close-up ended on.',drill:['Find the detail with the cleanest background','Shoot the close-up at 60 fps','Pull back on the same line','Roll 2s before and after'],checks:[]}
 },
 shots:[
  ['Money shot, front of house','wide','Exterior · Sony',2,1,1,'12mm','','ramp','exterior'],
  ['Drone opener','drone','Exterior · Drone',2,14,2,'Drone','','','drone'],
  ['Exterior close-up','closeup','Exterior · Sony',1,11,2,'50mm','A','','exterior'],
  ['Entrance, outside to inside','hero','Exterior · Sony',4,2,3,'12mm','A','ramp','entry'],
  ['Door detail','closeup','Interior · Main',1,1,1,'50mm','A','','entry'],
  ['Foyer','wide','Interior · Main',1,1,1,'12mm','','','entry'],
  ['Close-up','closeup','Interior · Main',1,11,2,'50mm','','','kitchen'],
  ['Rapid push 1','burst','Interior · Main',.5,1,2,'50mm','B','ramp','kitchen'],
  ['Rapid push 2','burst','Interior · Main',.5,1,2,'50mm','B','ramp','kitchen'],
  ['Rapid push 3','burst','Interior · Main',.5,1,2,'50mm','B','ramp','kitchen'],
  ['Rapid push 4','burst','Interior · Main',.5,1,2,'50mm','B','ramp','kitchen'],
  ['Kitchen wide','wide','Interior · Main',2,2,2,'12mm','','','kitchen'],
  ['Kitchen close-up','closeup','Interior · Main',1,11,2,'50mm','','','kitchen'],
  ['Pan','wide','Interior · Main',1,1,1,'12mm','','','kitchen'],
  ['50mm close-up','closeup','Interior · Main',1,9,2,'50mm','','','kitchen'],
  ['FPV freeze and reverse','hero','Interior · Main',4,5,3,'12mm','C','ramp','living'],
  ['Money shot, family room','wide','Interior · Main',2,1,2,'12mm','C','ramp','living'],
  ['Dining close-up','closeup','Interior · Main',1,11,2,'50mm','','','dining'],
  ['Dining','wide','Interior · Main',1,1,1,'12mm','','','dining'],
  ['Close-up','closeup','Interior · Main',1,9,2,'50mm','','','dining'],
  ['Stairs close-up','closeup','Interior · Main',1,10,3,'50mm','','','stairs'],
  ['Stairs','wide','Interior · Main',1,6,3,'12mm','','','stairs'],
  ['Master','wide','Interior · Second',2,1,2,'12mm','','ramp','bedroom'],
  ['Master close-up','closeup','Interior · Second',1,11,2,'50mm','','','bedroom'],
  ['En suite close-up','closeup','Interior · Second',1,9,2,'50mm','D','','ensuite'],
  ['En suite reverse ramp','wide','Interior · Second',2,1,3,'12mm','D','ramp','ensuite'],
  ['Bedroom','wide','Interior · Second',1,1,1,'12mm','','','bedroom'],
  ['Bedroom','wide','Interior · Second',1,1,1,'12mm','','','bedroom'],
  ['Bathroom','wide','Interior · Second',1,1,1,'12mm','','','ensuite'],
  ['Bedroom','wide','Interior · Second',1,1,1,'12mm','','','bedroom'],
  ['Basement','wide','Interior · Basement',2,7,2,'12mm','','ramp','basement'],
  ['Birdseye','drone','Exterior · Drone',2,14,2,'Drone','','','drone'],
  ['Backyard truck','wide','Exterior · Sony',2,11,2,'12mm','','','backyard'],
  ['360 drone','drone','Exterior · Drone',2,14,3,'Drone','','','drone'],
  ['Closing zoom','drone','Exterior · Drone',3,14,2,'Drone','','','drone']
 ].map((r,i)=>({id:'re'+(i+1),roll:'B',kind:r[1],beat:i<6?'Arrival':i<20?'Main floor':i<30?'Upstairs':'Finale',loc:r[2],pos:r[0],dur:r[3],move:r[4],hard:r[5],lens:r[6],fps:(r[4]===5?120:(r[8]==='ramp'||r[7])?60:30),combo:r[7]||undefined,script:'',gfx:'',broll:'',title:r[0],ramp:r[8]==='ramp',f:{scene:r[9],cap:r[1]==='burst'?'0.5s':''}}))
}
];
/* Links between combo clips on the reel */
(function(){const b=SEED_BOARDS.find(x=>x.id==='reel');const m={re3:'Ramp to the door',re4:'Ramp through the door',re8:'Hard cut',re9:'Hard cut',re10:'Hard cut',re16:'Reverse into the landing',re25:'Reverse ramp'};b.shots.forEach(s=>{if(m[s.id])s.link=m[s.id]})})();

/* Virtual tour: a linked horizontal version of the reel. Same shots, longer holds. */
/* The Hurley Special: kitchen reveal on the residential reel, right after Kitchen wide */
(function(){const r=SEED_BOARDS.find(x=>x.id==='reel');const i=r.shots.findIndex(x=>x.id==='re12');const n=JSON.parse(JSON.stringify(r.shots[i]));
Object.assign(n,{id:'re36',title:'The Hurley Special',pos:'The Hurley Special, ceiling down to full kitchen',kind:'hero',dur:4,move:15,hard:3,lens:'12mm',fps:60,f:{img:'img/hurley-special-vertical.jpg'}});
r.shots.splice(i+1,0,n);r.flags[0]='Runs about 10s over the 45s B-roll target with the Hurley Special added. Trim the drone finale first. The 3 agent segments (15s) are not in this list yet.'})();
(function(){const r=SEED_BOARDS.find(x=>x.id==='reel');r.shots.forEach(s=>s.lid=s.id);
const t=JSON.parse(JSON.stringify(r));t.id='tour';t.version='Virtual Tour';t.name='Standard Virtual Tour';t.sub='Linked to the reel · horizontal';t.aspect='16/9';t.target=120;
t.flags=['Hold times are a starting point, about 2.5x the reel. Set each one by hand.'];
t.shots.forEach((s,i)=>{s.id='vt'+(i+1);if(s.move===15)s.f={img:'img/hurley-special.jpg'};else s.dur=Math.max(2,Math.round(s.dur*5)/2)});SEED_BOARDS.push(t)})();

/* 1 Merino Rd: real house. Frames marked img are from Mike's Nov 4 walkthrough clip. */
(function(){
const R=(id,title,kind,loc,dur,move,hard,lens,combo,ramp,beat,f,o)=>Object.assign({id,lid:id,roll:'B',title,pos:title,kind,loc,dur,move,hard,lens,fps:(move===5?120:(ramp||combo)?60:30),combo:combo||undefined,ramp:!!ramp,beat,script:'',gfx:'',broll:'',f},o||{});
const A=(id,script,loc,beat,img,notes)=>({id,lid:id,roll:'A',kind:'medium',beat,loc,pos:'Agent to camera',dur:5,move:0,hard:1,lens:'24mm',fps:30,script,gfx:'Clean lower third, then back to B-roll.',broll:'',notes,f:{img}});
const X='Exterior · Sony',D='Exterior · Drone',M='Kitchen level',U='Bedroom level',T='Entrance level',Bs='Basement';
const b={id:'merino',cat:'luxury',family:'merino',linked:true,version:'Reel',name:'1 Merino Rd',sub:'Listing reel · 4-level semi in Maple · 60s',status:'Ready to shoot, not booked',target:60,outfit:'',
 flags:['Levels: basement, entrance, kitchen and family room, bedrooms. Tell me what else is on the entrance level (shot 28). Your clip says three bedrooms.','Agent shots need a tripod or a second person. Shoot day is Saturday or Sunday, weather depending.','House is vacant, so nothing to move. Fix the loose baseboard wires and clear any tools before rolling.'],
 kit:'Sony A7S III · DJI RS 4 · 12mm + 50mm · DJI Mavic 3 · tripod + wireless mic for agent shots',
 combos:{
  A:{name:'Front door, up to the kitchen reveal',why:'The opener. Brick and stone, ramp through the front door, then climb the stairs and rise into the kitchen level with the island in frame.',handoff:'Keep moving forward through every cut. Same speed through the door and up the stairs. Hide the cut in the ramp at the bottom step.',drill:['Prop the front door open','Walk from the sidewalk up to the island twice','Practise the stairs alone: smooth steps, camera level','Set exposure between outside and inside','Shoot all 3 clips back to back at 60 fps','Roll 2s before and after every clip'],checks:[]},
  B:{name:'Kitchen burst',why:'Four 0.5s pushes on the best finishes: gold sink, black stone, oven, faucet.',handoff:'Same direction and speed on all four, so they feel like one move.',drill:['Wipe the sink, stone and steel first','Same 50mm, same height for all four','Push at the same speed each time','Roll 3s per clip, the edit uses 0.5s'],checks:[]},
  C:{name:'Glass stairs FPV',why:'The hero of this house. FPV sweeps past the island and climbs the glass staircase to the bedroom level, freezes, reverses, then lands.',handoff:'End the FPV facing where the landing shot starts, then start from that exact step.',drill:['Walk the stairs with the gimbal, no recording','Watch for your reflection in the glass','Practise the turn from the island to the first step','Do one slow pass, then one at full speed','Shoot at 120 fps for the freeze and reverse','Shoot the landing from the top step','Review on the monitor before moving on'],checks:[]},
  D:{name:'Ensuite reverse ramp',why:'Close-up on the ensuite detail, ramping backward to reveal the room.',handoff:'Pull straight back from the spot the close-up ended on.',drill:['Find the cleanest detail in the ensuite','Stay out of the mirror','Shoot the close-up at 60 fps','Pull back on the same line, roll 2s each end'],checks:[]}
 },
 shots:[
  R('me1','Front of house, money shot','wide',X,2,1,1,'12mm','',1,'Arrival',{scene:'exterior'}),
  R('me2','Drone opener','drone',D,2,14,2,'Drone','','','Arrival',{scene:'drone'}),
  R('me3','Brick and stone close-up','closeup',X,1,11,2,'50mm','A','','Arrival',{scene:'exterior'},{link:'Ramp to the door'}),
  R('me4','Front door, outside to inside','hero',X,3,2,3,'12mm','A',1,'Arrival',{scene:'entry'},{link:'Ramp at the bottom step'}),
  R('me5','Climb the stairs, reveal the kitchen level','hero',T,2,7,3,'12mm','A',1,'Arrival',{img:'img/m1.jpg'},{notes:'Rise up the last steps so the island appears in frame.'}),
  A('me6','This is 1 Merino Road in Maple, south of Major Mac on Keele. Four finished levels, counting the basement.',M,'Agent 1','img/m2.jpg','Your location line from the clip, plus the level count.'),
  R('me7','Cube chandelier','closeup',M,1,10,3,'50mm','','','Kitchen level',{img:'img/m5.jpg'}),
  R('me8','Gold sink','burst',M,.5,1,2,'50mm','B',1,'Kitchen level',{img:'img/m6.jpg'},{link:'Hard cut'}),
  R('me9','Black stone','burst',M,.5,1,2,'50mm','B',1,'Kitchen level',{img:'img/m7.jpg'},{link:'Hard cut'}),
  R('me10','Built-in oven','burst',M,.5,1,2,'50mm','B',1,'Kitchen level',{scene:'kitchen'},{link:'Hard cut'}),
  R('me11','Black faucet','burst',M,.5,1,2,'50mm','B',1,'Kitchen level',{img:'img/m6.jpg'}),
  R('me12','Kitchen wide','wide',M,2,2,2,'12mm','','','Kitchen level',{img:'img/m4.jpg'}),
  R('me13','Waterfall island','closeup',M,1,9,2,'50mm','','','Kitchen level',{img:'img/m7.jpg'}),
  R('me14','Living room to the front windows','wide',M,1,1,1,'12mm','','','Kitchen level',{img:'img/m2.jpg'}),
  R('me15','Feature wall and gold shelves','closeup',M,1,8,1,'50mm','','','Kitchen level',{scene:'living'}),
  A('me16','Fantastic kitchen, lots of room, and great for entertaining.',M,'Agent 2','img/m1.jpg','Your words from the clip. Stand beside the island.'),
  R('me17','Stair tread and glass','closeup',M,1,11,2,'50mm','','','Stairs',{img:'img/m3.jpg'}),
  R('me18','FPV up the glass stairs','hero',M,4,5,3,'12mm','C',1,'Stairs',{img:'img/m3.jpg'},{link:'Freeze, reverse, land'}),
  R('me19','Bedroom-level landing','wide',U,1.5,1,2,'12mm','C',1,'Stairs',{scene:'stairs'}),
  R('me20','Primary bedroom','wide',U,2,1,2,'12mm','',1,'Bedrooms',{scene:'bedroom'}),
  R('me21','Walk-in closet','wide',U,1,1,1,'12mm','','','Bedrooms',{scene:'bedroom'}),
  R('me22','Ensuite close-up','closeup',U,1,9,2,'50mm','D','','Bedrooms',{scene:'ensuite'},{link:'Reverse ramp'}),
  R('me23','Ensuite reverse ramp','wide',U,2,1,3,'12mm','D',1,'Bedrooms',{scene:'ensuite'}),
  R('me24','Bathroom','wide',U,1,1,1,'12mm','','','Bedrooms',{scene:'ensuite'}),
  R('me25','Bedroom 2','wide',U,1,1,1,'12mm','','','Bedrooms',{scene:'bedroom'}),
  R('me26','Bedroom 3','wide',U,1,1,1,'12mm','','','Bedrooms',{scene:'bedroom'}),
  R('me27','Basement','wide',Bs,1.5,7,2,'12mm','',1,'Lower levels',{scene:'basement'}),
  R('me28','Entrance level','wide',T,1.5,1,2,'12mm','','','Lower levels',{scene:'entry'},{notes:'Tell me what else is on this level, then I will name the shot.'}),
  R('me29','Side lot truck','wide',X,2,11,2,'12mm','','','Finale',{scene:'backyard'}),
  R('me30','Birdseye','drone',D,2,14,2,'Drone','','','Finale',{scene:'drone'}),
  R('me31','360 drone','drone',D,2,14,3,'Drone','','','Finale',{scene:'drone'}),
  A('me32','If you have any questions, just DM me.',X,'Agent 3','img/m2.jpg','Your close from the clip. Film at the front door.'),
  R('me33','Closing pull-away','drone',D,2.5,14,2,'Drone','','','Finale',{scene:'drone'})
 ]};
SEED_BOARDS.push(b);
const t=JSON.parse(JSON.stringify(b));t.id='merinotour';t.version='Virtual Tour';t.name='1 Merino Rd · Virtual Tour';t.sub='Linked to the reel · horizontal';t.aspect='16/9';t.target=120;
t.flags=['Hold times are a starting point, about 2x the reel. Set each one by hand.'];t.status='Ready to shoot, not booked';
t.shots.forEach((s,i)=>{s.id='mt'+(i+1);s.dur=s.roll==='A'?s.dur:Math.max(2,s.dur*2)});SEED_BOARDS.push(t);
})();

/* Virtual Tour extras: gimbal moves the tour was not using. This version only, tagged EXTRA. */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');
const add=(after,id,title,kind,move,hard,lens,fps,dur)=>{const i=t.shots.findIndex(x=>x.lid===after);if(i<0)throw new Error('no '+after);const n=JSON.parse(JSON.stringify(t.shots[i]));delete n.combo;delete n.link;delete n.ramp;
Object.assign(n,{id,lid:id,title,pos:title,kind,move,hard,lens,fps,dur,extra:true,solo:true});t.shots.splice(i+1,0,n)};
add('re6','vtx1','Foyer height drop','wide',4,2,'12mm',60,3);
add('re15','vtx2','Island or faucet, wrap and rise','closeup',12,3,'50mm',60,3);
add('re17','vtx3','Feature wall or fireplace, slow zoom out','wide',8,1,'12mm',30,3);
add('re19','vtx4','Dining table orbit','wide',3,2,'12mm',60,3);
add('re24','vtx5','Vanity, top down pull back','closeup',13,2,'50mm',60,3);
t.flags.push('5 EXTRA shots added to bring in moves the tour was not using. They are on this version only.');
/* Swaps: repeat straight pushes changed to wide moves, same lens and hold time */
const swap=(lid,move,hard,pos)=>{const n=t.shots.find(x=>x.lid===lid);if(!n||n.move!==1)throw new Error('no swap '+lid);Object.assign(n,{move,hard,swapped:true,solo:true});if(pos){n.pos=pos;n.title=pos}};
swap('re6',2,2);swap('re14',3,2,'Kitchen island orbit');swap('re19',7,2);swap('re27',2,2);swap('re29',2,2);swap('re30',7,2);
t.flags.push('6 repeat Straight Pushes changed to other moves, tagged SWAP. Same lens, on this version only.');
t.shots.forEach(s=>{if(s.dur===10)s.dur=6;else if(s.dur===7.5)s.dur=5;else if(s.dur===5)s.dur=4});
t.flags.push('Trimmed to about 129s, 9s over the 120s target on purpose. The 2.5s shots stay as they are so orbits and other moves have time to play out.')})();

/* Condo starter board, drafted from the house list: no exterior, stairs or basement */
(function(){const r=SEED_BOARDS.find(x=>x.id==='reel');const b=JSON.parse(JSON.stringify(r));
const out=new Set(['re22','re21','re28','re29','re30']);
b.shots=b.shots.filter(s=>!s.loc.startsWith('Exterior')&&s.loc!=='Interior · Basement'&&!out.has(s.id));
b.shots.forEach((s,i)=>{s.id='co'+(i+1);s.lid=s.id;s.loc='Interior · Suite';if(s.beat==='Upstairs')s.beat='Bedrooms';if(s.beat==='Main floor')s.beat='Living';if(s.combo==='A'){delete s.combo;delete s.link}});
delete b.combos.A;delete b.family;delete b.linked;delete b.version;delete b.group;
Object.assign(b,{id:'condo',cat:'condos',name:'Standard Condo Reel',sub:'Starter list from the house reel · edit to suit',status:'Draft',target:30,kit:'Sony A7S III · DJI RS 4 · 12mm + 50mm',
flags:['Draft: built from the house list with the exterior, stairs and basement removed. Not a finished condo plan yet.','The Hurley Special needs room to back around an island. In a tight condo kitchen, check the path first. With no skylight, start on a ceiling feature or lights.']});
SEED_BOARDS.push(b)})();

/* Shoot day plan for the two scripts. Investment first (indoors), ending in the
   kitchen so the outfit change happens in place, then Social into golden hour. */
const SEED_META = {
  start:'12:45',
  starts:{merino:'10:00'},
  mins:{'merino|Kitchen level':80,'merino|Bedroom level':40,'merino|Basement':10,'merino|Entrance level':25,'merino|Exterior · Sony':30,'merino|Exterior · Drone':20},
  order:{merino:['merino|Kitchen level','merino|Bedroom level','merino|Basement','merino|Entrance level','merino|Exterior · Sony','merino|Exterior · Drone'],pinned:['invest|Living room','invest|Kitchen island','social|Kitchen island','social|Living room','social|Terrace','social|Patio']},
  notes:{'merino|Entrance level':'Combo A runs through here. Film the stairs climb and the front door shots as one run, with the exterior setup right after.','merino|Kitchen level':'Turn on every pot light and the chandelier. Warm up here on the easy moves, then do the glass stairs FPV while you are fresh.','merino|Exterior · Sony':'Front faces south, so aim for midday light on the brick and stone.','merino|Exterior · Drone':'No rain, light wind. Check the airspace for the site before you fly.','social|Terrace':'Light starts to warm up here. Combo A happens at this setup.','social|Patio':'Golden hour. Sunset is about 5:00 PM in early November, so this setup cannot slip.','social|Kitchen island':'Change to Outfit A here. Lights stay where they are.'}
};

/* Reel gets the 4 moves it was missing, using the same takes as the tour. Runs after the condo clone so the condo draft keeps its moves. */
(function(){const r=SEED_BOARDS.find(x=>x.id==='reel'),t=SEED_BOARDS.find(x=>x.id==='tour');
const sw=(id,o)=>{const n=r.shots.find(x=>x.id===id);if(!n)throw new Error('no reel '+id);Object.assign(n,{swapped:true,solo:true},o)};
sw('re14',{move:3,hard:2,title:'Kitchen island orbit',pos:'Kitchen island orbit',f:{img:'img/sb-kitchen-orbit-v.jpg'}});
sw('re15',{move:12,hard:3,fps:60,title:'Island or faucet, wrap and rise',pos:'Island or faucet, wrap and rise',f:{img:'img/sb-faucet-v.jpg'}});
sw('re29',{move:13,hard:2,kind:'closeup',lens:'50mm',fps:60,title:'Vanity, top down pull back',pos:'Vanity, top down pull back',f:{img:'img/sb-vanity-v.jpg'}});
sw('re30',{move:4,hard:2,f:{img:'img/sb-bedroom-drop-v.jpg'}});
r.flags.push('4 moves swapped in, tagged SWAP: Orbit, PTF Orbit, Top Down Detail and Yee-Haw Drop. Orbit, PTF Orbit and Top Down use the same take as the tour. Yee-Haw Drop on the bedroom is a poor fit and gets fixed after the tour. Seconds are a guide, set them in the edit.');
const img={re6:'foyer',vtx1:'foyer-drop',re14:'kitchen-orbit',vtx2:'faucet',vtx3:'fireplace',re19:'dining-push',vtx4:'dining-orbit',vtx5:'vanity',re27:'bedroom-curve',re28:'bedroom-push',re29:'bathroom',re30:'bedroom-drop'};
Object.keys(img).forEach(l=>{const n=t.shots.find(x=>x.lid===l);if(!n)throw new Error('no tour '+l);n.f={img:'img/sb-'+img[l]+'.jpg'}});
t.shots.find(x=>x.lid==='re15').solo=true;
t.flags.push('All storyboard images are AI planning references, not a real house.');t.flags.push('Hero clips for Yee-Haw Drop, Push + Rise, Tripod and Top Down Detail are hidden until real footage is added.');
r.flags.push('All storyboard images are AI planning references, not a real house.')})();

/* Every template shot gets a storyboard image. Tour is horizontal, reel and condo are vertical. */
(function(){const by=id=>SEED_BOARDS.find(x=>x.id===id);
const base={re1:'money-front',re2:'drone-open',re3:'ext-close',re4:'entrance',re5:'door',re7:'close',re8:'rapid1',re9:'rapid2',re10:'rapid3',re11:'rapid4',re12:'kitchen-wide',re13:'kitchen-close',re16:'fpv',re17:'family',re18:'dining-close',re20:'dining-detail',re21:'stairs-close',re22:'stairs',re23:'master',re24:'master-close',re25:'ensuite-close',re26:'ensuite',re31:'basement',re32:'birdseye',re33:'backyard',re34:'drone360',re35:'closing'};
const set=(b,l,n)=>{const s=b.shots.find(x=>x.lid===l);if(!s)throw new Error('no '+l);s.f={img:'img/sb-'+n+'.jpg'}};
const t=by('tour'),r=by('reel'),c=by('condo');
Object.keys(base).forEach(l=>{set(t,l,base[l]);set(r,l,base[l]+'-v')});
set(t,'re15','kitchen-detail');
Object.entries({re6:'foyer-v',re19:'dining-push-v',re27:'bedroom-curve-v',re28:'bedroom-push-v'}).forEach(([l,n])=>set(r,l,n));
['door','foyer','close','rapid1','rapid2','rapid3','rapid4','kitchen-wide',null,'kitchen-close','pan','detail','fpv','family','dining-close','dining','dining-detail','master','master-close','ensuite-close','ensuite','bedroom'].forEach((n,i)=>{if(n)set(c,'co'+(i+1),'c-'+n)});
c.flags.push('All storyboard images are AI planning references, not a real condo.')})();

/* Nov 7 fixes from Michael's tour review (Shoot Order numbers in Lens view) */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');
const sh=l=>{const n=t.shots.find(x=>x.lid===l);if(!n)throw new Error('no '+l);return n};
Object.assign(sh('vtx1'),{move:7,hard:2,title:'Foyer, push and tilt up',pos:'Foyer, push and tilt up'});
Object.assign(sh('vtx3'),{move:4,hard:2,fps:60,title:'Feature wall or fireplace, height drop',pos:'Feature wall or fireplace, height drop'});
Object.assign(sh('re21'),{move:11,hard:2,swapped:true,solo:true});
const add=(after,id,o)=>{const i=t.shots.findIndex(x=>x.lid===after);if(i<0)throw new Error('no '+after);const n=JSON.parse(JSON.stringify(t.shots[i]));delete n.combo;delete n.link;delete n.ramp;delete n.swapped;
Object.assign(n,{id,lid:id,extra:true,solo:true},o);t.shots.splice(i+1,0,n)};
add('re3','vtx6',{title:'Exterior detail, cowboy lift',pos:'Exterior detail, cowboy lift',kind:'closeup',move:10,hard:3,lens:'50mm',fps:60,dur:3,f:{img:'img/sb-ext-cowboy.jpg'}});
add('vtx4','vtx7',{title:'Dining chandelier, wrap and rise',pos:'Dining chandelier, wrap and rise',kind:'wide',move:12,hard:3,lens:'12mm',fps:60,dur:3,f:{img:'img/sb-dining-ptf.jpg'}});
t.shots.forEach((s,i)=>s.id='vt'+(i+1));
t.flags.push('Nov 7: Foyer is now a push and tilt up, the fireplace takes the Yee-Haw Drop, stairs close-up is a Detail Slider, and 2 EXTRA shots added (exterior Cowboy Lift, dining chandelier PTF Orbit on 12mm). Tour about 135s. Orbit has no How-to clip until a better one is found.')})();

/* Nov 7: Backyard becomes a Push Curve; cowboy lift detail goes 12mm, right after the kitchen */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');
const by=l=>{const n=t.shots.find(x=>x.lid===l);if(!n)throw new Error('no '+l);return n};
Object.assign(by('re33'),{move:2,hard:2,swapped:true,solo:true,title:'Backyard push and pan',pos:'Backyard push and pan'});
const i=t.shots.findIndex(x=>x.lid==='vtx6');const c=t.shots.splice(i,1)[0];
Object.assign(c,{lens:'12mm',kind:'wide',beat:'Main floor'});
const k=t.shots.findIndex(x=>x.lid==='vtx2');t.shots.splice(k+1,0,c);
t.shots.forEach((s,j)=>s.id='vt'+(j+1));
t.flags.push('Backyard is a Push Curve now (the old "truck" was a mistake). The exterior Cowboy Lift is 12mm and sits right after the kitchen. Ideas to try: a backyard drone near the start, and using the Cowboy Lift in a combo.')})();

/* Nov 7: clear shot names on the tour, Entrance as a push with a fill-in, two exterior details side by side */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');
const by=l=>{const n=t.shots.find(x=>x.lid===l);if(!n)throw new Error('no '+l);return n};
const names={re1:'Exterior Hero',re2:'Drone Opener',re3:'Exterior Feature Detail',vtx6:'Exterior Detail',re4:'Entrance',re5:'Front Door Detail',re6:'Foyer',vtx1:'Foyer Height',re7:'Kitchen Detail',re8:'Rapid Push 1',re9:'Rapid Push 2',re10:'Rapid Push 3',re11:'Rapid Push 4',re12:'Kitchen Hero',re36:'The Hurley Special',re13:'Kitchen Range Detail',re14:'Kitchen Hero 2',re15:'Kitchen Feature',vtx2:'Kitchen Faucet',re16:'FPV Freeze and Reverse',re17:'Family Room Hero',vtx3:'Feature Wall and Fireplace',re18:'Dining Detail',re19:'Dining Room',vtx4:'Dining Table Orbit',vtx7:'Dining Chandelier',re20:'Dining Feature',re21:'Stairs Close-up',re22:'Stairs',re23:'Master Hero',re24:'Master Detail',vtx5:'Vanity Top Down',re25:'En Suite Detail',re26:'En Suite',re27:'Bedroom',re28:'Bedroom',re29:'Bathroom',re30:'Bedroom',re31:'Basement',re32:'Birdseye',re33:'Backyard Hero',re34:'360 Drone',re35:'Closing Zoom'};
Object.entries(names).forEach(([l,n])=>{const s=by(l);s.title=n;s.pos=n});
Object.assign(by('re4'),{move:1,ask:'Push for now. Fill in for the house: rise for a high ceiling, curve to turn into the foyer.'});
const i=t.shots.findIndex(x=>x.lid==='vtx6');const c=t.shots.splice(i,1)[0];
t.shots.splice(t.shots.findIndex(x=>x.lid==='re3'),0,c);
t.shots.forEach((s,j)=>s.id='vt'+(j+1));
t.flags.push('Shot names cleaned up. Entrance is a push for now; fill in rise or curve for the house. The two exterior details sit side by side so you can pick one.')})();

/* Nov 7: Exterior Detail now sits with the arrival shots */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');t.shots.find(x=>x.lid==='vtx6').beat='Arrival'})();

/* Nov 7: each main room's wide shot is a Hero (Michael) */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');
['re1','re6','vtx1','re12','re17','re19','re23','re26','re31','re33'].forEach(l=>{const n=t.shots.find(x=>x.lid===l);if(!n)throw new Error('no '+l);n.kind='hero'});
Object.entries({re6:'Foyer Hero',vtx1:'Foyer Height Hero',re19:'Dining Room Hero',re26:'En Suite Hero',re31:'Basement Hero'}).forEach(([l,n])=>{const x=t.shots.find(y=>y.lid===l);x.title=n;x.pos=n})})();

/* Hero rule (Michael): a Hero is a push-type move (Straight Push, Push Curve, Push + Rise) on a main room, wide. Orbits and specials are not Heroes. */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');const PUSH=[1,2,7];
t.shots.forEach(s=>{if(s.kind==='hero'&&!PUSH.includes(s.move))s.kind='wide'})})();

/* Nov 7 (Michael): Front Door Detail is never used. Family Room gets a detail shot with the Detail Slider Rise instead. */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');
const i=t.shots.findIndex(x=>x.lid==='re5');if(i<0)throw new Error('no re5');const old=t.shots.splice(i,1)[0];
const n=JSON.parse(JSON.stringify(old));['combo','link','ask','swapped','ramp'].forEach(k=>delete n[k]);
Object.assign(n,{id:'vtx8',lid:'vtx8',title:'Family Room Detail',pos:'Family Room Detail',kind:'closeup',loc:'Interior · Main',beat:'Main floor',move:16,hard:2,lens:'50mm',fps:60,dur:2.5,extra:true,solo:true,f:{img:'img/sb-family-detail.jpg'}});
t.shots.splice(t.shots.findIndex(x=>x.lid==='re17')+1,0,n);
t.shots.forEach((s,j)=>s.id='vt'+(j+1));
t.flags.push('Front Door Detail removed. New Family Room Detail uses the Detail Slider Rise (clips to come).')})();

/* Nov 7 (Michael): burst shots are wide, on the 12mm */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');t.shots.filter(s=>s.kind==='burst').forEach(s=>{s.lens='12mm'})})();


/* Nov 7 (Michael): 3 drone moves from the drone tutorial video, on the tour's drone shots. 360 Drone stays an orbit. */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');[['re2',17],['re32',18],['re35',19]].forEach(([l,m])=>{const x=t.shots.find(y=>y.lid===l);if(!x)throw new Error('no '+l);x.move=m;x.hard=m===18?3:2})})();

/* Nov 7 (Michael): the Boss Level orbit is his kitchen orbit, kitchen only. */
(function(){const t=SEED_BOARDS.find(x=>x.id==='tour');const x=t.shots.find(y=>y.lid==='re14');if(!x)throw new Error('no re14');x.move=20;x.hard=3})();
