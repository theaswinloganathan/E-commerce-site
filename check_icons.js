import * as Lucide from 'lucide-react';
const keys = Object.keys(Lucide);
['Facebook', 'Instagram', 'Twitter', 'Youtube', 'Github', 'Linkedin'].forEach(name => {
    console.log(`${name}:`, keys.filter(k => k.includes(name)));
});
