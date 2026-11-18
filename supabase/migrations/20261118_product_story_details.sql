-- Product story & details for Aram Toy World.
-- 1) Adds details columns (safe to re-run).  2) Fills story + details for the 30 real toys.
-- Run once in the Supabase SQL Editor.

alter table public.products add column if not exists details text;
alter table public.products add column if not exists details_ar text;

update public.products set description_ar = 'البطوطة الصفرا جت تغنّي مع طفلك! كل زرار بيطلع صوت حيوان، وكل مفتاح بيعزف نغمة ومعاها نور.', description = 'The little yellow duck came to sing with your child! Every button makes an animal sound and every key plays a note with lights.', details_ar = 'العمر: من ٣ سنين
٧ مفاتيح بيانو ملوّنة بالأرقام
٦ أزرار أصوات حيوانات
أنوار وأصوات
المقاس: ٢٧ × ٢٢ سم', details = 'Age: 3+
7 colorful numbered piano keys
6 animal sound buttons
Lights and sounds
Size: 27 × 22 cm' where name = 'Duck Piano with Lights & Sounds';
update public.products set description_ar = 'الكلبوظ اللطيف عنده فرقة كاملة: ضفدع وبقرة وكتكوت وقرد! يدوس طفلك على أي واحد ويسمع صوته ويعزف معاهم.', description = 'The cute puppy has a whole band: a frog, a cow, a chick and a monkey! Your child presses any friend to hear it and plays along.', details_ar = 'العمر: من ٣ سنين
٨ مفاتيح بيانو ملوّنة
٦ أزرار أصوات حيوانات
متوفر بلونين: أبيض وأزرق أو بيج وبني
المقاس: ٢٩ × ١٨.٥ سم', details = 'Age: 3+
8 colorful piano keys
6 animal sound buttons
Two colors: white & blue or beige & brown
Size: 29 × 18.5 cm' where name = 'Dog Piano with Animal Sounds';
update public.products set description_ar = 'الكلب العضّاض نايم جنب طبق العضم… مين يقدر ياخد عضمة من غير ما يصحى ويهجم؟ لعبة ضحك وحماس لكل العيلة.', description = 'The grumpy dog is guarding his bones… who can sneak one away before he snaps? A giggly, suspenseful game for the whole family.', details_ar = 'العمر: من ٣ سنين
عدد اللاعبين: ٢ أو أكتر
فيها عضم ملوّن وطبق أكل
بتنمّي التركيز وسرعة رد الفعل', details = 'Age: 3+
Players: 2 or more
Includes colorful bones and a food bowl
Builds focus and quick reactions' where name = 'Bad Dog – Steal the Bone Game';
update public.products set description_ar = '٣ ألعاب في علبة واحدة! خيوط وكرات واستراتيجية… كل جولة تحدّي جديد بين طفلك وصحابه.', description = 'Three games in one box! Strings, marbles and strategy… every round is a new challenge with friends.', details_ar = 'العمر: من ٣ سنين
عدد اللاعبين: من ٢ لـ ٤
٣ ألعاب: الخيوط والكرات والاستراتيجية
بتنمّي التفكير المنطقي والتركيز
القطر: ٢٢ سم', details = 'Age: 3+
Players: 2–4
3 games: strings, marbles and strategy
Builds logical thinking and focus
Diameter: 22 cm' where name = '3-in-1 Strategy & Puzzle Challenge Game';
update public.products set description_ar = 'حط حجرك جوّه الدايرة بهدوء… لو لزق في حجر تاني يبقى ليك! اللي يخلّص أحجاره الأول يكسب.', description = 'Place your stone inside the circle carefully… if it snaps to another, you take them! First to run out of stones wins.', details_ar = 'العمر: من ٦ سنين
عدد اللاعبين: من ٢ لـ ٤
أحجار مغناطيس وحبل وكيس قماش
لعبة سريعة ومثالية للخروجات', details = 'Age: 6+
Players: 2–4
Magnetic stones, rope and a cloth bag
Quick game, perfect for outings' where name = 'Magnetic Stones Challenge Game';
update public.products set description_ar = 'الأرنوبة البينك بتنوّر رسمة على الترابيزة، وطفلك يرسم فوقها ويلوّنها… وبعدين يمسح ويبدأ رسمة جديدة.', description = 'The pink bunny projects a picture onto the table, your child traces and colors it… then wipes it clean for a new one.', details_ar = 'العمر: من ٣ سنين
جهاز عرض رسومات و٣ أقراص
٨ أقلام تلوين وممحاة ودفتر رسم
سطح رسم بيتمسح
المقاس: ٣٠ × ٢٤ × ٣٧ سم', details = 'Age: 3+
Projector with 3 picture discs
8 markers, eraser and drawing book
Wipe-clean drawing surface
Size: 30 × 24 × 37 cm' where name = 'Pink Bunny Projection Drawing Table';
update public.products set description_ar = 'البقرة اللبنية جايبة معاها رسومات كتير! تنوّرها على الترابيزة وطفلك يتعلم يرسم خطوة بخطوة.', description = 'The friendly cow brings lots of pictures! It lights them onto the table so your child learns to draw step by step.', details_ar = 'العمر: من ٣ سنين
جهاز عرض رسومات و٣ أقراص
٨ أقلام تلوين وممحاة ودفتر رسم
سطح رسم بيتمسح
المقاس: ٣٠ × ٢٤ × ٣٦ سم', details = 'Age: 3+
Projector with 3 picture discs
8 markers, eraser and drawing book
Wipe-clean drawing surface
Size: 30 × 24 × 36 cm' where name = 'Blue Cow Projection Drawing Table';
update public.products set description_ar = 'الكائن الأزرق نزل من الفضاء وقال: يلا نرسم! ينوّر الرسمة وطفلك يكمّلها بألوانه.', description = 'The little blue alien landed and said: let us draw! It lights up a picture and your child finishes it with colors.', details_ar = 'العمر: من ٣ سنين
جهاز عرض رسومات و٣ أقراص
٨ أقلام تلوين وممحاة ودفتر رسم
سطح رسم بيتمسح
المقاس: ٣٠ × ٢٤ × ٣٦ سم', details = 'Age: 3+
Projector with 3 picture discs
8 markers, eraser and drawing book
Wipe-clean drawing surface
Size: 30 × 24 × 36 cm' where name = 'Blue Alien Projection Drawing Table';
update public.products set description_ar = 'الديناصور الأصفر بيحب الرسم والمزيكا! يشغّل أغنية وينوّر رسمة… وطفلك يرسم ويغني معاه.', description = 'The yellow dino loves drawing and music! It plays a tune and projects a picture… your child draws and sings along.', details_ar = 'العمر: من ٣ سنين
فيها موسيقى
جهاز عرض و٣ أقراص رسومات
٨ أقلام وممحاة ودفتر رسم ومجسّم ديناصور
العلبة بيد – مناسبة للهدايا', details = 'Age: 3+
Plays music
Projector with 3 picture discs
8 markers, eraser, drawing book and a dino figure
Gift box with handle' where name = 'Yellow Dino Musical Projection Drawing Table';
update public.products set description_ar = 'عربية سباق… لا استنى، دي روبوت! بزرار واحد تتحوّل وتلف ٣٦٠ درجة بالأنوار.', description = 'A race car… no wait, it is a robot! One button transforms it, and it spins 360° with lights.', details_ar = 'العمر: من ٦ سنين
ريموت كنترول
بتتحوّل من عربية لروبوت
أنوار LED ولف ٣٦٠°
بطارية بتتشحن + كابل USB', details = 'Age: 6+
Remote control
Transforms from car to robot
LED lights and 360° spins
Rechargeable battery + USB cable' where name = 'Transforming RC Robot Car with Lights';
update public.products set description_ar = 'تسريحة أميرة حقيقية بتاج ومراية منوّرة! بنتك تتزيّن وتعمل شعرها بالسشوار وتعيش يوم أميرة.', description = 'A real princess vanity with a crown and a glowing mirror! Your little one dresses up, styles her hair and lives a princess day.', details_ar = 'العمر: من ٣ سنين
٤٢ قطعة إكسسوارات ومكياج لعب
مراية بإضاءة LED وأصوات
سشوار لعب وأرفف للتخزين
المقاس: ٥١ × ٣١ × ٥٥ سم', details = 'Age: 3+
42 accessory and pretend makeup pieces
LED mirror and sounds
Toy hair dryer and storage shelves
Size: 51 × 31 × 55 cm' where name = 'Princess Vanity Table with LED Mirror – 42 pcs (Crown)';
update public.products set description_ar = 'الفيونكة الحمرا بتقول: أهلاً يا أميرة! تسريحة كبيرة فيها حاجات كتير تخلّي كل يوم حفلة.', description = 'The big red bow says: hello princess! A large vanity packed with goodies that make every day a party.', details_ar = 'العمر: من ٣ سنين
٥٧ قطعة إكسسوارات ومكياج لعب
مراية بإضاءة LED وأصوات
سشوار لعب ورفّين للتخزين
المقاس: ٥١ × ٣١ × ٥٥ سم', details = 'Age: 3+
57 accessory and pretend makeup pieces
LED mirror and sounds
Toy hair dryer and two storage shelves
Size: 51 × 31 × 55 cm' where name = 'Princess Vanity Table with LED Mirror – 57 pcs (Bow)';
update public.products set description_ar = 'الشيف الصغير فتح مطعمه! بيتزا في الفرن، وخضار في الطاسة، والعيلة كلها مستنية الأكل.', description = 'The little chef just opened a restaurant! Pizza in the oven, veggies in the pan, and the whole family is waiting to eat.', details_ar = 'مطبخ بفرن بشباك
حلّة وطاسة ومعالق ومغارف
خضار وفاكهة وبيتزا لعب
العلبة بيد – مناسبة للهدايا', details = 'Kitchen with see-through oven
Pot, pan, spoons and ladles
Toy veggies, fruit and pizza
Gift box with handle' where name = 'Little Chef Kitchen Playset';
update public.products set description_ar = 'الدكتور الصغير وصل! يكشف على الدبدوب بالسماعة، ويديله الدوا، ويطمّن الكل إنه بقى كويس.', description = 'The little doctor is here! Checking teddy with the stethoscope, giving medicine and making sure everyone feels better.', details_ar = 'شنطة دبدوب بعجل ويد
سماعة وحقنة وترمومتر ونظارة
أزايز دوا ومقص وكارت الدكتور
موديلين بأحجام مختلفة – بيوصل واحد منهم
مقاس العلبة: ٤٠ × ٣٢ × ٧.٥ سم', details = 'Teddy-shaped case with wheels and handle
Stethoscope, syringe, thermometer and glasses
Medicine bottles, scissors and doctor card
Two sizes mixed – one is sent
Box: 40 × 32 × 7.5 cm' where name = 'Little Doctor First Aid Play Set';
update public.products set description_ar = 'البومتين اللبني بيحبوا الأغاني! جيتار بأوتار حقيقية يخلّي طفلك يعزف أول لحن ليه.', description = 'The two blue owls love songs! A guitar with real strings so your child can play a first tune.', details_ar = '٤ أوتار حقيقية
من غير بطاريات
رسومات بومة وفراشات
علبة عرض مثلثة', details = '4 real strings
No batteries needed
Owl and butterfly design
Triangle display box' where name = 'Kids Mini Guitar – Blue Owls';
update public.products set description_ar = 'القطة البينك عاملة حفلة! جيتار صغير بأوتار حقيقية لأحلى نجمة في البيت.', description = 'The pink kitty is throwing a concert! A mini guitar with real strings for the little star of the house.', details_ar = '٤ أوتار حقيقية
من غير بطاريات
رسومات قطط وقلوب
علبة عرض مثلثة', details = '4 real strings
No batteries needed
Kitty and hearts design
Triangle display box' where name = 'Kids Mini Guitar – Pink Kitty';
update public.products set description_ar = 'البطل الأحمر مش بس بينقذ المدينة… كمان بيعزف! جيتار بأوتار حقيقية للأبطال الصغيرين.', description = 'The red hero does not only save the city… he plays music too! A real-string guitar for little heroes.', details_ar = '٤ أوتار حقيقية
من غير بطاريات
رسومات البطل الأحمر
علبة عرض مثلثة', details = '4 real strings
No batteries needed
Red hero design
Triangle display box' where name = 'Kids Mini Guitar – Red Hero';
update public.products set description_ar = 'شنطة سفر بعجل… تفتحها تلاقي ورشة كاملة! النجار الصغير جاهز يصلّح أي حاجة في البيت.', description = 'A rolling suitcase… open it and it becomes a full workshop! The little builder is ready to fix anything at home.', details_ar = 'شنطة بعجل ويد بتنسحب
بتتفتح ترابيزة شغل على رجول
منشار وزرادية ومفتاح ومسطرة زاوية
نظارة حماية ومسامير وصواميل', details = 'Rolling case with pull-out handle
Opens into a workbench on legs
Saw, pliers, wrench and square ruler
Safety goggles, screws and nuts' where name = 'Little Builder Tool Trolley – Opens into Workbench';
update public.products set description_ar = 'الشنطة دي بتتحوّل لعيادة كاملة! الدكتور الصغير يكشف ويقيس ويكتب الروشتة لكل المرضى.', description = 'This suitcase turns into a full clinic! The little doctor checks, measures and writes prescriptions for every patient.', details_ar = 'شنطة بعجل ويد بتنسحب
بتتفتح عيادة على رجول
سماعة وحقنة وميكروسكوب وجهاز قلب
بخّاخة وملقاط وكارت الدكتور', details = 'Rolling case with pull-out handle
Opens into a clinic on legs
Stethoscope, syringe, microscope and heart monitor
Spray bottle, tweezers and doctor card' where name = 'Little Doctor Trolley – Opens into Clinic';
update public.products set description_ar = 'السلحفاة التركواز عايزة مهندس شاطر! يركّب التروس والمسامير بالشنيور ويبني روبوت بنفسه.', description = 'The turquoise turtle needs a clever engineer! Drill in gears and screws to build a robot all by yourself.', details_ar = 'لوحة بخروم ومسامير وتروس ملوّنة
شنيور ومفتاح لعب
بناء رسومات ومجسّمات 3D
بتنمّي التخطيط وحركة الإيد
العلبة بيد', details = 'Peg board with colorful screws and gears
Toy drill and wrench
Build 2D pictures and 3D models
Builds planning and fine motor skills
Box with handle' where name = 'Drill & Build 3D Puzzle Board – Turtle';
update public.products set description_ar = 'الأرنوبة البينك بتحب الألوان! ترتّب المسامير الملوّنة وتعمل رسومات وتبني مجسّمات تحفة.', description = 'The pink bunny loves colors! Arrange the colorful screws to make pictures and build amazing models.', details_ar = 'لوحة بخروم ومسامير ملوّنة
شنيور ومفتاح لعب
بناء رسومات ومجسّمات 3D
بتنمّي الإبداع والتركيز
العلبة بيد', details = 'Peg board with colorful screws
Toy drill and wrench
Build 2D pictures and 3D models
Builds creativity and focus
Box with handle' where name = 'Drill & Build 3D Puzzle Board – Pink Bunny';
update public.products set description_ar = 'فرس النهر الأزرق جايب ٢٤٩ قطعة! كل يوم اختراع جديد: روبوت، طيارة، أو أي حاجة في خيال طفلك.', description = 'The blue hippo brings 249 pieces! A new invention every day: a robot, a plane, or anything your child imagines.', details_ar = '٢٤٩ قطعة
لوحة بخروم ومسامير وتروس
شنيور ومفك ومفتاح لعب
بناء رسومات ومجسّمات 3D', details = '249 pieces
Peg board with screws and gears
Toy drill, screwdriver and wrench
Build 2D pictures and 3D models' where name = 'Drill & Build 3D Puzzle Board – Blue Hippo 249 pcs';
update public.products set description_ar = 'البيك أب المستقبلي نزل الشارع! شكله غريب وقوي، وأنواره بتنوّر الطريق قدّامه.', description = 'The futuristic pickup hits the road! Bold, edgy and powerful, with lights that brighten the way.', details_ar = 'العمر: من ٨ سنين
ريموت على شكل دركسيون
أنوار وصوت
بطارية بتتشحن + كابل USB
مقاس ١:١٦ – ٢٧ × ١١ × ٩.٦ سم
لون عشوائي: فضي أو رمادي أو أزرق', details = 'Age: 8+
Steering-wheel style remote
Lights and sound
Rechargeable battery + USB cable
1:16 scale – 27 × 11 × 9.6 cm
Random color: silver, grey or blue' where name = 'Cyber Pickup RC Truck with Lights & Sound – 1:16';
update public.products set description_ar = 'اقعد ورا الدركسيون ودوس بنزين! طفلك يسوق بنفسه بالدوّاسات زي السوّاقين الكبار.', description = 'Grab the wheel and hit the gas! Your child drives with real pedals just like a grown-up racer.', details_ar = 'العمر: من ٨ سنين
دركسيون ودوّاسات بنزين وفرامل
أنوار وصوت
بطارية بتتشحن + كابل USB
مقاس ١:١٦ – ٢٧ × ١١.٥ × ٦.٥ سم
لون عشوائي: أحمر أو أخضر أو أزرق', details = 'Age: 8+
Steering wheel with gas and brake pedals
Lights and sound
Rechargeable battery + USB cable
1:16 scale – 27 × 11.5 × 6.5 cm
Random color: red, green or blue' where name = 'RC Sports Car with Steering Wheel & Pedals – 1:16';
update public.products set description_ar = 'جيتار صغير بشكل الخشب الطبيعي… أول خطوة لطفلك في عالم المزيكا الحقيقية.', description = 'A little ukulele with a natural wood look… the first step into real music.', details_ar = '٤ أوتار نايلون
مفاتيح ضبط سهلة
من غير بطاريات
متوفر ٣ ألوان: خشبي وأبيض وبينك', details = '4 nylon strings
Easy tuning pegs
No batteries needed
3 colors: wood, white and pink' where name = 'Kids Ukulele – Natural Wood Look';
update public.products set description_ar = 'عربية سباق مكشوفة بتطير على الأرض! أنوارها منوّرة، وطفلك ماسك الريموت وبيكسب كل سباق.', description = 'A convertible race car that flies across the floor! Headlights on, remote in hand, your child wins every race.', details_ar = 'العمر: من ٨ سنين
قدّام وورا ويمين وشمال
أنوار أمامية
بطارية بتتشحن + كابل USB
مقاس ١:١٦ – ٢٧ × ١١ × ٦.٥ سم
لون عشوائي', details = 'Age: 8+
Forward, backward, left and right
Headlights
Rechargeable battery + USB cable
1:16 scale – 27 × 11 × 6.5 cm
Random color' where name = 'RC Convertible Sports Car with Lights – 1:16';
update public.products set description_ar = 'مفيش طريق صعب على الباجي! عجل كبير ومساعدين وكشافات… ودركسيون ودوّاسات كأنك سايق بجد.', description = 'No road is too rough for this buggy! Big wheels, suspension and roof lights… plus a steering wheel and pedals like a real driver.', details_ar = 'العمر: من ٨ سنين
دركسيون ودوّاسات بنزين وفرامل
عجل أوف رود ومساعدين
أنوار وصوت
بطارية بتتشحن + كابل USB
مقاس ١:١٦ – ٢٨ × ١١.٥ × ٩ سم', details = 'Age: 8+
Steering wheel with gas and brake pedals
Off-road wheels and suspension
Lights and sound
Rechargeable battery + USB cable
1:16 scale – 28 × 11.5 × 9 cm' where name = 'RC Off-Road Buggy with Steering Wheel & Pedals – 1:16';
update public.products set description_ar = 'العربية الفخمة دي بتحس بإيدك! ميّل الدركسيون يمين أو شمال وهي تلف معاك… أكبر وأقوى عربية في عالمنا.', description = 'This luxury car feels your moves! Tilt the wheel left or right and it turns with you… the biggest car in our world.', details_ar = 'العمر: من ٦ سنين
تحكم بالإمالة + دوّاسات بنزين وفرامل
أنوار وصوت
بطاريات بتتشحن + كابل USB
مقاس ١:١٢ – ٣٥ × ١٢.٥ × ٨ سم', details = 'Age: 6+
Gravity-sensing wheel + gas and brake pedals
Lights and sound
Rechargeable batteries + USB cable
1:12 scale – 35 × 12.5 × 8 cm' where name = 'Luxury RC Sports Car with Gravity-Sensing Steering Wheel & Pedals – 1:12';
update public.products set description_ar = 'العربية الحمرا فيها سباق جوّاها! حرّك الدركسيون وفادي العربيات اللي جاية عليك.', description = 'The red car has a race inside! Turn the wheel and dodge the cars coming your way.', details_ar = 'العمر: من ٣ سنين
شاشة لعبة سباق ودركسيون
أنوار أمامية وصوت
المقاس: ١٧.٥ × ١١ × ٥.٥ سم', details = 'Age: 3+
Racing game screen with steering wheel
Headlights and sound
Size: 17.5 × 11 × 5.5 cm' where name = 'Small Adventure Racing Car Game – Red';
update public.products set description_ar = 'العربية الصفرا الكبيرة جاهزة لأكبر سباق! دركسيون كبير وشاشة سباق وأنوار… والبطولة لطفلك.', description = 'The big yellow car is ready for the biggest race! A large wheel, a racing screen and lights… and the trophy goes to your child.', details_ar = 'العمر: من ٣ سنين
شاشة لعبة سباق ودركسيون كبير
أنوار أمامية وصوت
المقاس: ٣٩.٥ × ٢٤ × ١٠.٥ سم', details = 'Age: 3+
Racing game screen with big steering wheel
Headlights and sound
Size: 39.5 × 24 × 10.5 cm' where name = 'Big Adventure Racing Car Game – Yellow';

-- Check: should return 30
select count(*) as filled from public.products where description_ar is not null and details_ar is not null;
