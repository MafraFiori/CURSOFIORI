sap.ui.define([
    "zappcursorick/controller/App.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/library",
    "sap/m/MessagePopover",
    "sap/m/MessageItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MLibrary, MessagePopover, MessageItem) {
        "use strict";

        var oMessagePopover;

        return Controller.extend("zappcursorick.controller.View1", {
            onInit: function () {
                this.criaModeloAuxiliar()
            },

            criaModeloAuxiliar: function () {
                let oModel = new JSONModel()
                let objeto = {
                    Menssagens: [],
                    Editable: false
                }

                oModel.setData(objeto)
                this.getView().setModel(oModel, "Auxiliar")

                this.AlimentaModeloMenssagens()
            },

            AlimentaModeloMenssagens: function () {
                let oMessageTemplate = new MessageItem({
                    type: '{Auxiliar>type}',
                    title: '{Auxiliar>title}',
                    activeTitle: "{Auxiliar>active}",
                    description: '{Auxiliar>description}',
                    subtitle: '{Auxiliar>subtitle}',
                    counter: '{Auxiliar>counter}'
                });

                oMessagePopover = new MessagePopover({
                    items: {
                        path: 'Auxiliar>/Menssagens',
                        template: oMessageTemplate
                    },
                    activeTitlePress: function () {

                    }
                });

                var messagePopoverBtn = this.byId("messagePopoverBtn");

                if (messagePopoverBtn) {
                    this.byId("messagePopoverBtn").addDependent(oMessagePopover);
                }
            },

            acessaMaterialCurso: function () {
                let URLHelper = MLibrary.URLHelper;
                URLHelper.redirect("https://uh924mhkawsbhi-my.sharepoint.com/personal/exed_academy_exedconsulting_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fexed%5Facademy%5Fexedconsulting%5Fcom%2FDocuments%2F01%2E%20CURSOS%2FC035%20%2D%20SAP%20FIORI%20%28%40BRA%5FABERTO%29%2F03%2E%20Diret%C3%B3rio%20Alunos%20%2D%20Curso%20SAP%20FIORI%2F01%2E%20Materiais&ct=1713275873542&or=Teams%2DHL&ga=1", true);
            },

            acessaGitHub: function () {
                let URLHelper = MLibrary.URLHelper;
                URLHelper.redirect("https://github.com/MafraFiori/CURSOFIORI.git", true);
            },

            onDeleta: function () {
                let that = this
                let oModel = this.getView().getModel()
                let oModelAuxiliar = this.getView().getModel("Auxiliar")
                let Table = this.getView().byId("idTable")
                let selecionados = Table.getSelectedContextPaths()
                if (selecionados.length > 0) {
                    sap.m.MessageBox.alert("Confirma a exclusão de todos os alunos selecionados?", {
                        actions: ["Sim", "Não"],
                        onClose: function (sAction) {
                            if (sAction == "Sim") {
                                let Indice
                                for (let i = 0; i < selecionados.length; i++) {
                                    Indice = selecionados[i]
                                    oModel.remove(Indice, {
                                        success: function () {
                                            let arrayMsg = {
                                                type: "Success",
                                                title: "Aluno excluido com sucesso",
                                                activeTitle: true,
                                                description: "O aluno com indice " + Indice + " foi excluido com sucesso!!!",
                                            }
                                            oModelAuxiliar.oData.Menssagens.push(arrayMsg);
                                            oModelAuxiliar.refresh(true);

                                            that.byId("messagePopoverBtn").setType("Accept");
                                            oMessagePopover.openBy(that.getView().byId("messagePopoverBtn"));
                                        },
                                        error: function () {
                                            let arrayMsg = {
                                                type: "Error",
                                                title: "Erro ao excluir o aluno",
                                                activeTitle: true,
                                                description: "Erro ao excluir o aluno com indice " + Indice + " !!!",
                                            }
                                            oModelAuxiliar.oData.Menssagens.push(arrayMsg);
                                            oModelAuxiliar.refresh(true);

                                            that.byId("messagePopoverBtn").setType("Accept");
                                            oMessagePopover.openBy(that.getView().byId("messagePopoverBtn"));
                                        }
                                    })
                                }
                            }
                        }
                    })
                } else {
                    sap.m.MessageBox.error("Selecione ao menos um aluno para exclusão!!!")
                }
            },

            onAdciona: function () {
                if (!this.adicionar) {
                    this.adicionar = sap.ui.xmlfragment("zappcursorick.view.fragmentos.Adicionar", this);
                    this.getView().addDependent(this.adicionar);
                }
                // open value help dialog filtered by the input value
                this.adicionar.open();
            },

            CancelarAdicionar: function () {
                this.adicionar.close();
            },

            GravaAdicionar: function () {
                let that = this
                let oModel = this.getView().getModel()
                let oModelAuxiliar = this.getView().getModel("Auxiliar")
                let Usuario = this.adicionar.mAggregations.content[0].getValue()
                let Nome = this.adicionar.mAggregations.content[1].getValue()
                let Email = this.adicionar.mAggregations.content[2].getValue()
                let Projeto = this.adicionar.mAggregations.content[3].getValue()

                sap.m.MessageBox.alert("Confirma a inclusão?", {
                    actions: ["Sim", "Não"],
                    onClose: function (sAction) {
                        if (sAction == "Sim") {
                            let objeto = {
                                Usuario: Usuario,
                                Nome: Nome,
                                ProjetoSegw: Projeto,
                                Email: Email
                            }
                            oModel.create('/AlunosFioriSet', objeto, {
                                success: function (oData, oReponse) {
                                    let arrayMsg = {
                                        type: "Success",
                                        title: "Aluno incluido com sucesso !!!",
                                        activeTitle: true,
                                        description: "O aluno " + Usuario + " foi incluido com sucesso!!!",
                                    }
                                    oModelAuxiliar.oData.Menssagens.push(arrayMsg);
                                    oModelAuxiliar.refresh(true);

                                    that.byId("messagePopoverBtn").setType("Accept");
                                    oMessagePopover.openBy(that.getView().byId("messagePopoverBtn"));
                                    that.CancelarAdicionar()
                                },
                                error: function (oError) {
                                    let arrayMsg = {
                                        type: "Error",
                                        title: "Erro ao incluir aluno !!!",
                                        activeTitle: true,
                                        description: "Erro ao incluir aluno " + Usuario + " !!!",
                                    }
                                    oModelAuxiliar.oData.Menssagens.push(arrayMsg);
                                    oModelAuxiliar.refresh(true);

                                    that.byId("messagePopoverBtn").setType("Accept");
                                    oMessagePopover.openBy(that.getView().byId("messagePopoverBtn"));
                                }
                            });
                        }
                    }
                })
            },

            handleMessagePopoverPress: function () {
                oMessagePopover.openBy(this.getView().byId("messagePopoverBtn"));
            },

            onEdit: function () {
                let Table = this.getView().byId("idTable")
                let selecionados = Table.getSelectedItems();
                if (selecionados.length > 0) {
                    if (selecionados.length > 1) {
                        sap.m.MessageBox.error("Só poderá ser editado um registro por vez !!!")
                    } else {
                        let id = selecionados[0].mAggregations.cells[0].getProperty("text")

                        this.getRouter().navTo("RouteDetalhe", {
                            id
                        });
                    }
                }

            }

        });
    });
