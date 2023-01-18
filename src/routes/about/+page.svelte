<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Tile,
		ExpandableTile,
		Tooltip,
		TooltipDefinition,
		Link,
		ButtonSet,
		Button
	} from 'carbon-components-svelte';

	import Home from 'carbon-icons-svelte/lib/Home.svelte';
	import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import LogoInstagram from 'carbon-icons-svelte/lib/LogoInstagram.svelte';

	export let data;
	let { prerender } = data;

	prerender = true;
</script>

<article>
	<Tile>
		<h1>About</h1>
		<br />
		<h3># About</h3>
		<p>
			<span class="bold">Virtual Olympiad (VOLY or VO)</span> is an online multiplayer practice platform for contest math.
			<br />
			<br />
			Team up and have fun with your friends in highly customizable lobbies featuring various gamemodes
			and problemset options. VOLY not only helps you prepare for math contests, but also provides a
			fun and competitive spin while doing so.
			<br />
			<br />
			The first Virtual Olympiad platform was created by
			<Link href="https://polarr.github.io/">Polarity (@mango)</Link> in late 2021, which received generally
			positive feedback but was very buggy and unpolished. In Summer 2022, polarity revisited the project
			and did a rewrite, resulting in the much more sophisticated VOLY platform today.
			<br />
			<br />
			The original Virtual Olympiad platform was instrumental in helping a small friendgroup interested
			in the sciences evolve into a full STEM organization! That was the origin of <span class="bold">Math et al</span>, a
			non-for-profit STEM organization founded and ran by high school students. We now host many events,
			contests, and projects in Math, CS, Physics, and more. Our team is highly qualified with many national
			and international olympiad qualifiers in various sciences.
		</p>

		<h3># Our Mission</h3>
		<p class="indented">
			To inspire both aspiring and experienced competitive mathematics contestants through a modern
			platform with an emphasis on personal enjoyment and collaboration. We aim to build a welcoming
			yet competitive environment where competitors are not only opponents, but also companions.
		</p>
		<br />
		<h1 id="faq">
			FAQ
		</h1>
		<br />
		<Accordion style="margin-bottom: 5rem;">
			<AccordionItem title="What is Math et al?">
				<p>
					We are a non-profit STEM organization, founded by a few high school students (we
					originated from the original Virtual Olympiad project!). Our team is very qualified with
					many national and international olympiad qualifiers in various sciences. Our goal is to
					provide other students enthusiastic about STEM with resources in the form of events,
					contests, and projects (like VOLY)! Why? We enjoy STEM and want to share the fun!
				</p>
				<br />
				<Button href="https://mathetal.org/" kind="ghost" iconDescription="Website" icon={Home} />
				<Button
					href="https://mathetal.org/discord"
					kind="ghost"
					iconDescription="Discord"
					icon={LogoDiscord}
				/>
				<Button
					href="https://mathetal.org/github"
					kind="ghost"
					iconDescription="Github"
					icon={LogoGithub}
				/>
				<Button kind="ghost" iconDescription="Instagram" icon={LogoInstagram} />
			</AccordionItem>
			<AccordionItem title="What is Virtual Olympiad Premium?">
				<p>
					VOLY Premium gives your account some additional features such as enhanced
					customizability and larger room sizes. You can only obtain it through special events that
					Math et al hosts. Join our <Link target="_blank" href="https://mathetal.org/discord"
						>Discord</Link
					> to be notified when they happen!
				</p>
			</AccordionItem>
			<AccordionItem title="This platform is too hard to use!">
				<p>
					Check out the
					<Link href="/guide">Guide</Link> for a comprehensive tutorial to using the platform. Helpful
					<TooltipDefinition tooltipText="Like this!">tooltips</TooltipDefinition> are also present all
					around the site. If you still need support, join our
					<Link target="_blank" href="https://mathetal.org/discord">Discord</Link> and we'll be glad
					to help you out there!
				</p>
			</AccordionItem>
			<AccordionItem title="How can I do ... on the platform?">
				<p>
					See the <Link href="/guide">Guide</Link> for a comprehensive tutorial to VOLY. If you would like to see a new feature, suggestions are welcome on the <Link href="https://mathetal.org/github"
						>Github Repo</Link
					> and our
					<Link target="_blank" href="https://mathetal.org/discord">Discord Server</Link>!
				</p>
			</AccordionItem>
			<AccordionItem title="A problem isn't loading correctly/Something's wrong with the site!">
				<p>
					You've likely caught a bug! Please report bugs and other issues to polarity and the Math
					et al team through (preferred) the
					<TooltipDefinition
						tooltipText="Click the hamburger menu on the top right, the find the button at the very bottom."
						>Report a Bug</TooltipDefinition
					> button, the
					<Link target="_blank" href="https://mathetal.org/discord">Discord Server</Link>, or <Link
						href="https://mathetal.org/github">Github</Link
					>. Include the <TooltipDefinition
						tooltipText="Find the problem ID by clicking the tooltip beside a problem."
						>Problem ID</TooltipDefinition
					> for problem loading issues.
				</p>
			</AccordionItem>
			<AccordionItem title="How can I/Why should I donate?">
				<p>
					Donations are extremely appreciated and possible on the <Link href="/donate"
						>Donation Page</Link
					>. As stated there, the majority (basically all) of Math et al's projects, contests, and
					events are funded from our own pockets, and we recieve no monetary benefit from spending
					time on any of this. We rely on donations to pay server costs for projects like VOLY and
					to fund Math et al's future contests and events.
				</p>
			</AccordionItem>
			<AccordionItem title="How did you make this site?">
				<p>
					This platform was built with SvelteKit (frontend), Node (websocket server), and Firebase
					(auth & db). The frontend and core code is open source and available on <Link
						href="https://mathetal.org/github">Github</Link
					>.
				</p>
			</AccordionItem>
		</Accordion>
	</Tile>
</article>

<style lang="scss">
	article {
		max-width: 1056px;
	}

	p {
		margin: 1rem;
	}

	.indented {
		padding: 1rem;
		border-left: 2px solid #0160e2;
	}

	.bold {
		font-weight: 600;
	}
</style>
