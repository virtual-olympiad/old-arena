<script lang="ts">
	import Textfield from '@smui/textfield';
	import CharacterCounter from '@smui/textfield/character-counter';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
    import Drawer, { AppContent } from '@smui/drawer';
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';

	// Player username
	let username = '';

	interface DrawerItem {
		label: string;
		icon?: string;
	}

    let drawerToggle = 0;
    let drawerItems = [{label: 'Create', icon: 'add_circle'}, {label: 'Join', icon: 'travel_explore'}, /*{label: 'Custom', icon: 'star'},*/ {label: 'Contests', icon: 'verified'}];
</script>

<section>
	<div class="drawer-container">
		<Drawer>
			<Content>
                <div class="username-field">
                    <Textfield variant="filled" bind:value={username} label="Username" input$maxlength={18}>
                        <CharacterCounter slot="helper">0 / 18</CharacterCounter>
                    </Textfield>
                </div>
				<List>
                    {#each drawerItems as {label, icon}, i}
					<Item on:click = {()=> {drawerToggle = i}}>
						<Graphic class="material-icons">
							{icon}
						</Graphic>
						<Text>{label}</Text>
					</Item>
                    {/each}
				</List>

				<!-- Footer Copyright -->
				<footer class = "copyright">Math et al</footer>
			</Content>
		</Drawer>

		<AppContent class="app-content">
			<main class="main-content">
				App content.
				<br />
			</main>
		</AppContent>
	</div>
</section>

<style lang="scss">
    @import '../variables.scss';

	section {
		position: relative;
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

        .drawer-container {
            position: relative;
            display: flex;
            height: 100%;
            width: 100%;
            border: 1px solid $border-color;
            overflow: hidden;
            z-index: 0;

			.username-field {
				padding: 1rem;
			}

			.copyright {
				position: absolute;
				bottom: 0;

				padding: .5rem;
			}
        }

		.main-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
		}
	}
</style>
