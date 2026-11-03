package templates

import (
	"os"
	"strings"
	"testing"
)

// Protect the canvas and player-list contracts used by the existing JS renderer.
func TestRadarLayoutContract(t *testing.T) {
	data, err := os.ReadFile("pages/radar.gohtml")
	if err != nil {
		t.Fatal(err)
	}
	source := string(data)
	required := []string{
		"radar-workspace", "radar-map-pane", "radar-players-pane",
		"canvasContainer", "mapCanvas", "drawCanvas", "ourPlayerCanvas", "uiCanvas",
		"playersSection", "playersHostile", "playersFaction", "playersPassive",
		"settingRadarZoom", "settingCanvasSize", "settingIconSize",
		"radarQuickToggle", "radarQuickPanel",
	}
	for _, id := range required {
		if !strings.Contains(source, id) {
			t.Errorf("radar template lost required UI contract: %s", id)
		}
	}
	groups := []string{"Segurança", "Tesouros", "Coleta", "Exploração", "Criaturas", "Caçadas (Tracking)"}
	for _, group := range groups {
		if !strings.Contains(source, group) {
			t.Errorf("radar template missing category: %s", group)
		}
	}
	if got := strings.Count(source, "<details class=\"radar-category\""); got != len(groups) {
		t.Errorf("got %d filter groups, want %d", got, len(groups))
	}
}

func TestRadarQuickSettingsAreKnown(t *testing.T) {
	data, err := os.ReadFile("pages/radar.gohtml")
	if err != nil {
		t.Fatal(err)
	}
	source := string(data)
	settings := []string{
		"settingShowPlayers", "settingSound", "settingFlash",
		"settingHiddenTreasures", "settingAvaloneDrones",
		"settingAllAspects", "settingAllGuardians", "settingFishing",
		"settingWispSpawn", "settingShowKnightfallAbbey", "settingShowMap",
	}
	for _, setting := range settings {
		if !strings.Contains(source, "data-radar-setting=\""+setting+"\"") {
			t.Errorf("missing bound quick toggle %s", setting)
		}
	}
	if !strings.Contains(source, "settingsSync.setBool(key, input.checked)") {
		t.Error("quick toggles must persist changes via SettingsSync")
	}
}
